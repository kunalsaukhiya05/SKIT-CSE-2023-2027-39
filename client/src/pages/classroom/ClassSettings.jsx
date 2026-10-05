import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassSettings = ({ classData, isTeacher, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: classData?.title || '',
        subject: classData?.subject || '',
        description: classData?.description || '',
        date: classData?.date ? new Date(classData.date).toISOString().slice(0, 16) : '',
        maxStudents: classData?.maxStudents || 50,
        isRecordingEnabled: classData?.isRecordingEnabled || false,
        allowStudentChat: classData?.allowStudentChat !== false,
        allowStudentMic: classData?.allowStudentMic !== false,
        allowStudentCamera: classData?.allowStudentCamera !== false,
        allowScreenShare: classData?.allowScreenShare !== false,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate?.(formData);
            toast.success('Class settings updated successfully!');
            setIsEditing(false);
        } catch (err) {
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClass = () => {
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            onDelete?.(classData?._id);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-800 text-white flex items-center justify-between">
                <h2 className="font-semibold text-lg">Class Settings</h2>
                {isTeacher && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">Edit</button>
                )}
            </div>

            <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingsField label="Class Title" name="title" value={formData.title} onChange={handleChange} disabled={!isEditing} />
                        <SettingsField label="Subject" name="subject" value={formData.subject} onChange={handleChange} disabled={!isEditing} />
                        <SettingsField label="Date & Time" name="date" type="datetime-local" value={formData.date} onChange={handleChange} disabled={!isEditing} />
                        <SettingsField label="Max Students" name="maxStudents" type="number" value={formData.maxStudents} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} disabled={!isEditing} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500" />
                    </div>
                </div>

                {/* Permissions */}
                {isTeacher && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Student Permissions</h3>
                        <div className="space-y-3">
                            <ToggleSetting label="Allow Student Chat" description="Students can send text messages during class" name="allowStudentChat" checked={formData.allowStudentChat} onChange={handleChange} disabled={!isEditing} />
                            <ToggleSetting label="Allow Student Microphone" description="Students can unmute and speak during class" name="allowStudentMic" checked={formData.allowStudentMic} onChange={handleChange} disabled={!isEditing} />
                            <ToggleSetting label="Allow Student Camera" description="Students can turn on their camera" name="allowStudentCamera" checked={formData.allowStudentCamera} onChange={handleChange} disabled={!isEditing} />
                            <ToggleSetting label="Allow Screen Sharing" description="Students can share their screen" name="allowScreenShare" checked={formData.allowScreenShare} onChange={handleChange} disabled={!isEditing} />
                            <ToggleSetting label="Enable Recording" description="Record the class session for later playback" name="isRecordingEnabled" checked={formData.isRecordingEnabled} onChange={handleChange} disabled={!isEditing} />
                        </div>
                    </div>
                )}

                {/* Room Info (Read-only) */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Room Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Room ID:</span><span className="font-mono text-gray-900">{classData?.roomId || 'Not assigned'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Created By:</span><span className="text-gray-900">{classData?.teacherName || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Students Enrolled:</span><span className="text-gray-900">{classData?.students?.length || 0}</span></div>
                    </div>
                </div>

                {/* Actions */}
                {isEditing && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                )}

                {isTeacher && (
                    <div className="pt-4 border-t border-gray-200">
                        <button onClick={handleDeleteClass} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            Delete this class permanently
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsField = ({ label, name, type = 'text', value, onChange, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500" />
    </div>
);

const ToggleSetting = ({ label, description, name, checked, onChange, disabled }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} disabled={disabled} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 peer-disabled:opacity-50"></div>
        </label>
    </div>
);

export default ClassSettings;
