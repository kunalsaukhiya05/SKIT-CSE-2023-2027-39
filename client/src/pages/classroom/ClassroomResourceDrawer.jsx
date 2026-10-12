import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomResourceDrawer = ({ isOpen, onClose, role, classTitle }) => {
    const isTeacher = role === 'teacher';
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [resources, setResources] = useState([
        {
            id: 1,
            title: 'Lecture Slides - Unit 3 Computer Networks',
            category: 'slides',
            format: 'PDF',
            size: '1.2 MB',
            bandwidthTag: 'Low bandwidth friendly',
            author: 'Teacher',
            timestamp: 'Today, 10:15 AM',
            url: '#',
        },
        {
            id: 2,
            title: 'Offline Code Examples & Handouts',
            category: 'code',
            format: 'ZIP',
            size: '340 KB',
            bandwidthTag: 'Ultra Light (<500KB)',
            author: 'Teacher',
            timestamp: 'Yesterday',
            url: '#',
        },
        {
            id: 3,
            title: 'Assignment Reference Questions & Solutions',
            category: 'notes',
            format: 'DOCX',
            size: '850 KB',
            bandwidthTag: 'Low bandwidth friendly',
            author: 'Teacher',
            timestamp: 'Oct 8',
            url: '#',
        },
    ]);

    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('slides');
    const [showUploadForm, setShowUploadForm] = useState(false);

    const handleUploadResource = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error('Please enter a title for the study material');
            return;
        }

        const newResource = {
            id: Date.now(),
            title: newTitle.trim(),
            category: newCategory,
            format: newCategory === 'slides' ? 'PDF' : newCategory === 'code' ? 'ZIP' : 'DOCX',
            size: '420 KB',
            bandwidthTag: 'Ultra Light (<500KB)',
            author: 'You (Teacher)',
            timestamp: 'Just now',
            url: '#',
        };

        setResources([newResource, ...resources]);
        setNewTitle('');
        setShowUploadForm(false);
        toast.success('Study resource shared with students in real-time!');
    };

    const filtered = resources.filter((r) => {
        const matchesCategory = activeTab === 'all' || r.category === activeTab;
        const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📁</span>
                        <div>
                            <h3 className="text-sm font-bold">In-Class Resources & Notes</h3>
                            <p className="text-xs text-gray-400 truncate max-w-[220px]">{classTitle || 'Live Session Materials'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300">
                        ✕
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b text-xs font-semibold bg-gray-50">
                    {['all', 'slides', 'notes', 'code'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 uppercase transition-colors ${
                                activeTab === tab ? 'border-b-2 border-teal-600 text-teal-700 bg-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="p-3 border-b">
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Upload Form (Teacher Only) */}
                {isTeacher && (
                    <div className="px-4 py-2 border-b bg-teal-50 flex justify-between items-center">
                        <span className="text-xs font-semibold text-teal-800">Share instant file with class</span>
                        <button
                            onClick={() => setShowUploadForm(!showUploadForm)}
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-md font-medium"
                        >
                            {showUploadForm ? 'Cancel' : '+ Upload Material'}
                        </button>
                    </div>
                )}

                {showUploadForm && (
                    <form onSubmit={handleUploadResource} className="p-4 border-b bg-gray-50 space-y-2.5">
                        <input
                            type="text"
                            placeholder="Resource Title (e.g. Slide Deck Chapter 4)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full text-xs border rounded p-2"
                        />
                        <div className="flex gap-2">
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="flex-1 text-xs border rounded p-1.5 bg-white"
                            >
                                <option value="slides">Slides (PDF)</option>
                                <option value="notes">Lecture Notes</option>
                                <option value="code">Code / Project Files</option>
                            </select>
                            <button type="submit" className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-teal-700">
                                Share Now
                            </button>
                        </div>
                    </form>
                )}

                {/* Resource List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl block mb-2">📄</span>
                            <p className="text-sm">No resources found in this category</p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-xl p-3.5 hover:shadow-sm transition-shadow bg-white flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</h4>
                                        <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                            {item.format}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-xs text-gray-500">{item.size}</span>
                                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                            {item.bandwidthTag}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-400">
                                    <span>{item.timestamp}</span>
                                    <button
                                        onClick={() => toast.success(`Downloading ${item.title} (Simulated)...`)}
                                        className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
                                    >
                                        ⬇ Download
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassroomResourceDrawer;
