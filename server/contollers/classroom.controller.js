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
      classes: classes,
    });
  } catch (err) {
    console.error("Error in Fetch All Classes:", err);
    res.status(500).json({ message: "Error In Fetch All Classes", error: err.message });
  }
};

// Classroom Details & Student Roster Populate [Kunal Saukhiya]
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

// Student Enrollment & Capacity Bounds Check [Kunal Saukhiya]
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


// Student Unenrollment Handler [Manish Regar]
const leaveClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.studentId;

    const cls = await classModel.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    cls.students = cls.students.filter((id) => id.toString() !== studentId.toString());
    await cls.save();

    res.status(200).json({ message: "Unenrolled from class successfully", classId });
  } catch (err) {
    console.error("Error leaving class:", err);
    res.status(500).json({ message: "Error leaving class", error: err.message });
  }
};

// Live Meeting Room Access Verification [Manish Regar]
const verifyRoomAccess = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.studentId || req.teacherId;

    const cls = await classModel.findOne({ roomId });
    if (!cls) {
      return res.status(404).json({ message: "Classroom not found for this room ID" });
    }

    const isHost = cls.teacherId && cls.teacherId.toString() === userId.toString();
    const isEnrolled = cls.students.some((id) => id.toString() === userId.toString());

    if (!isHost && !isEnrolled) {
      return res.status(403).json({ message: "Access denied: You are not enrolled in this class" });
    }

    res.status(200).json({
      message: "Room access verified",
      roomId: cls.roomId,
      title: cls.title,
      isLive: cls.isLive,
      status: cls.status,
    });
  } catch (err) {
    console.error("Error verifying room access:", err);
    res.status(500).json({ message: "Error verifying room access", error: err.message });
  }
};


// Classroom Summary & Analytics Aggregation [Manish Regar]
const getClassroomStats = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const teacherClasses = await classModel.find({ teacherId });

    const totalClasses = teacherClasses.length;
    const liveClasses = teacherClasses.filter((c) => c.status === "live").length;
    const upcomingClasses = teacherClasses.filter((c) => c.status === "scheduled").length;
    const totalEnrollments = teacherClasses.reduce((acc, c) => acc + (c.students?.length || 0), 0);

    res.status(200).json({
      message: "Classroom statistics fetched successfully",
      stats: {
        totalClasses,
        liveClasses,
        upcomingClasses,
        totalEnrollments,
      },
    });
  } catch (err) {
    console.error("Error fetching classroom stats:", err);
    res.status(500).json({ message: "Error fetching classroom stats", error: err.message });
  }
};


// End Live Classroom Session [Manish Regar]
const endClassroomSession = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.teacherId;

    const cls = await classModel.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    if (cls.teacherId && cls.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Only class teacher can end session" });
    }

    cls.status = "completed";
    cls.isLive = false;
    cls.updatedAt = new Date();
    await cls.save();

    res.status(200).json({ message: "Classroom session ended successfully", class: cls });
  } catch (err) {
    console.error("Error ending classroom session:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Join Class by Room Code / Meeting Code [Manish Regar]
const joinClassByCode = async (req, res) => {
  try {
    const { code } = req.body;
    const studentId = req.studentId;

    if (!code) {
      return res.status(400).json({ message: "Class code or Room ID is required" });
    }

    const trimmedCode = code.trim();
    const query = trimmedCode.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ roomId: trimmedCode }, { _id: trimmedCode }] }
      : { roomId: trimmedCode };

    const cls = await classModel.findOne(query);
    if (!cls) {
      return res.status(404).json({ message: "Classroom not found for the provided code" });
    }

    if (!cls.students.some((id) => id.toString() === studentId.toString())) {
      if (cls.students.length >= (cls.maxCapacity || 100)) {
        return res.status(403).json({ message: "Classroom capacity reached" });
      }
      cls.students.push(studentId);
      await cls.save();
    }

    res.status(200).json({
      message: "Successfully admitted to classroom",
      classId: cls._id,
      roomId: cls.roomId,
      title: cls.title,
      isLive: cls.isLive,
    });
  } catch (err) {
    console.error("Error joining class by code:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Active Meeting Session Heartbeat Ping [Manish Regar]
const meetingHeartbeat = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.studentId || req.teacherId;

    const cls = await classModel.findOne({ roomId });
    if (!cls) {
      return res.status(404).json({ message: "Classroom session not found" });
    }

    res.status(200).json({
      status: "alive",
      isLive: cls.isLive,
      classStatus: cls.status,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in meeting heartbeat:", err);
    res.status(500).json({ message: "Heartbeat failed", error: err.message });
  }
};


// Rural Bandwidth Optimization & Audio-Only Stream Mode Toggle [Kunal Saukhiya]
const toggleLowBandwidthMode = async (req, res) => {
  try {
    const { id } = req.params;
    const { lowBandwidthMode } = req.body;
    const updatedClass = await classModel.findByIdAndUpdate(
      id,
      { lowBandwidthMode: Boolean(lowBandwidthMode) },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    return res.status(200).json({
      message: lowBandwidthMode ? "Low bandwidth mode enabled" : "Low bandwidth mode disabled",
      class: updatedClass,
    });
  } catch (err) {
    console.error("Error updating bandwidth mode:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = { toggleLowBandwidthMode,  createClassroom, AllClassess, getClassById, joinClass, getTeacherClasses, leaveClass, verifyRoomAccess, getClassroomStats, endClassroomSession, joinClassByCode, meetingHeartbeat };

