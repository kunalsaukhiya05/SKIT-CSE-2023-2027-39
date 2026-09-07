const resourceModel = require("../models/resource.model");
const notificationModel = require("../models/notification.model");
const cloudinary = require("cloudinary").v2;

// Upload resource (Teacher)
const uploadResource = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const { title, description, subject, category, teacherName, classId } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject are required" });
    }

    if (!req.files?.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const file = req.files.file;
    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "resources",
      resource_type: "auto",
    });

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

    const newResource = await resourceModel.create({
      title,
      description: description || "",
      subject,
      category: category || "Other",
      fileUrl: uploadResponse.secure_url,
      fileName: file.name,
      fileSize: `${fileSizeMB} MB`,
      teacherId,
      teacherName: teacherName || "Teacher",
      classId: classId || null,
    });

    // Notify students about new resource
    await notificationModel.create({
      title: "New Resource Available",
      message: `New ${category || "resource"} "${title}" has been uploaded for ${subject}.`,
      type: "resource",
      recipientType: "student",
      senderId: teacherId,
      senderName: teacherName || "Teacher",
    });

    return res.status(201).json({
      message: "Resource uploaded successfully",
      resource: newResource,
    });
  } catch (err) {
    console.error("Error uploading resource:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all resources
const getResources = async (req, res) => {
  try {
    const { subject, category, teacherId } = req.query;

    let query = {};
    if (subject) query.subject = subject;
    if (category && category !== "All") query.category = category;
    if (teacherId) query.teacherId = teacherId;

    const resources = await resourceModel
      .find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Resources fetched successfully",
      resources,
    });
  } catch (err) {
    console.error("Error fetching resources:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Delete resource (Teacher)
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.teacherId;

    const resource = await resourceModel.findOne({ _id: id, teacherId });
    if (!resource) {
      return res.status(404).json({ message: "Resource not found or unauthorized" });
    }

    await resourceModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Error deleting resource:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = { uploadResource, getResources, deleteResource };
