const noteModel = require("../models/note.model");
const notificationModel = require("../models/notification.model");
const cloudinary = require("cloudinary").v2;

// Upload Study Material / Note (Teacher) [Manish Regar]
const uploadNote = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const { title, description, subject, topic, category, teacherName, classId, tags } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ success: false, message: "Title and subject are required" });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: "Study material file is required" });
    }

    const file = req.files.file;
    // Enforce 25MB ceiling for rural bandwidth preservation
    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return res.status(400).json({ success: false, message: "File exceeds rural limit of 25MB" });
    }

    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "classroom_notes",
      resource_type: "auto",
    });

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const ext = file.name.split(".").pop().toLowerCase();

    let tagList = [];
    if (tags) {
      tagList = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    }

    const newNote = await noteModel.create({
      title,
      description: description || "",
      subject,
      topic: topic || "General",
      category: category || "Lecture Notes",
      fileUrl: uploadResponse.secure_url,
      fileName: file.name,
      fileSize: `${fileSizeMB} MB`,
      fileType: ext,
      cloudinaryPublicId: uploadResponse.public_id || "",
      teacherId,
      teacherName: teacherName || "Teacher",
      classId: classId || null,
      tags: tagList,
      isLowBandwidthOptimized: file.size < 5 * 1024 * 1024,
    });

    // Notify enrolled students
    try {
      await notificationModel.create({
        title: "New Study Material Uploaded",
        message: `New note '${title}' is now available for ${subject}.`,
        type: "resource",
        recipientType: "student",
        senderId: teacherId,
        senderName: teacherName || "Teacher",
      });
    } catch (notifErr) {
      console.warn("Notification skipped:", notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Study note uploaded successfully to Cloudinary",
      note: newNote,
    });
  } catch (err) {
    console.error("Error uploading note:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Get Notes with Subject, Category, Topic and Search Filters [Manish Regar]
const getNotes = async (req, res) => {
  try {
    const { subject, category, topic, q, classId, teacherId, page = 1, limit = 20 } = req.query;

    const query = {};
    if (subject && subject !== "All") {
      query.subject = new RegExp(`^${subject}$`, "i");
    }
    if (category && category !== "All") {
      query.category = category;
    }
    if (topic && topic !== "All") {
      query.topic = new RegExp(topic, "i");
    }
    if (classId) {
      query.classId = classId;
    }
    if (teacherId) {
      query.teacherId = teacherId;
    }
    if (q) {
      query.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [notes, total] = await Promise.all([
      noteModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      noteModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      notes,
    });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Get List of Distinct Subjects with Note Counts [Manish Regar]
const getDistinctSubjects = async (req, res) => {
  try {
    const subjects = await noteModel.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      subjects: subjects.map((s) => ({ subject: s._id, count: s.count })),
    });
  } catch (err) {
    console.error("Error fetching distinct subjects:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Get Single Note by ID [Manish Regar]
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    return res.status(200).json({ success: true, note });
  } catch (err) {
    console.error("Error fetching note by id:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = { uploadNote, getNotes, getDistinctSubjects, getNoteById };
