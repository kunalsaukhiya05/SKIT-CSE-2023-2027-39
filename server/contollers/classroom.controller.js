const classModel = require("../models/class.model");

const createClassroom = async (req, res) => {
  const { title, subject, date, description, teacherName } = req.body;
  try {
    if (!title || !subject || !date) {
      return res.status(400).json({ message: "Title, subject, and date are required" });
    }

    // Schedule validation and duration checks [Manish Regar]
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid class date format" });
    }
    if (parsedDate < new Date(Date.now() - 5 * 60 * 1000)) {
      return res.status(400).json({ message: "Cannot schedule class in the past" });
    }
    const classDuration = Number(req.body.duration) || 60;
    if (classDuration < 15 || classDuration > 300) {
      return res.status(400).json({ message: "Class duration must be between 15 and 300 minutes" });
    }

    // Generate unique room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newClass = await classModel.create({
      title,
      subject,
      description: description || "",
      date: new Date(date),
      roomId,
      duration: classDuration,
      maxCapacity: Number(req.body.maxCapacity) || 100,
      teacherId: req.teacherId,
      teacherName: teacherName || "Teacher",
    });

    res.status(201).json({ message: "Class Created Successfully", newClass });
  } catch (err) {
    console.error("Error in Create Classroom:", err);
    res.status(500).json({ message: "Error in Create Classroom", error: err.message });
  }
};

const AllClassess = async (req, res) => {
  try {
    const { status, subject } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (subject) filter.subject = new RegExp(subject, "i");

    // Optimized projection and teacher reference population [Manish Regar]
    const classes = await classModel
      .find(filter)
      .populate("teacherId", "fullName email subjectSpecialization profileImage")
      .select("-students")
      .sort({ date: -1 });

    res.status(200).json({
      message: "All Classes",
      count: classes.length,
      AllClassess: classes,
    });
  } catch (err) {
    console.error("Error in Fetch All Classes:", err);
    res.status(500).json({ message: "Error In Fetch All Classes", error: err.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const cls = await classModel.findById(id);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class fetched", class: cls });
  } catch (err) {
    console.error("Error fetching class:", err);
    res.status(500).json({ message: "Error fetching class", error: err.message });
  }
};

const joinClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.studentId;

    const cls = await classModel.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Add student if not already enrolled
    if (!cls.students.includes(studentId)) {
      cls.students.push(studentId);
      await cls.save();
    }

    res.status(200).json({ 
      message: "Joined class successfully", 
      class: cls,
      roomId: cls.roomId,
    });
  } catch (err) {
    console.error("Error joining class:", err);
    res.status(500).json({ message: "Error joining class", error: err.message });
  }
};

const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const classes = await classModel.find({ teacherId }).sort({ date: -1 });
    res.status(200).json({ message: "Teacher classes", classes });
  } catch (err) {
    console.error("Error fetching teacher classes:", err);
    res.status(500).json({ message: "Error fetching teacher classes", error: err.message });
  }
};

module.exports = { createClassroom, AllClassess, getClassById, joinClass, getTeacherClasses };
