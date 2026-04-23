import { useEffect, useState } from "react";
import { useStore } from "../../../store/useStore";

const TEMPLATE_CATEGORIES = [
    "Applied",
    "Shortlisted",
    "Interviewed",
    "Hired",
    "Rejected",
] as const;

type Category = (typeof TEMPLATE_CATEGORIES)[number];

type Template = {
    _id: string;
    title: string;
    content: string;
};

export default function MessageTemplates() {
    const templates = useStore((state: any) => state.templates);
    const fetchTemplates = useStore((state: any) => state.fetchTemplates);
    const saveTemplate = useStore((state: any) => state.saveTemplate);
    const deleteTemplate = useStore((state: any) => state.deleteTemplate);

    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const resetForm = () => {
        setForm({ title: "", content: "" });
        setActiveCategory(null);
        setEditingId(null);
    };

    const handleSubmit = async (category: Category) => {
        if (!form.title || !form.content) return;

        try {
            setLoading(true);
            await saveTemplate({
                _id: editingId || undefined, // if editingId exists, it will update
                status: category,
                title: form.title,
                content: form.content,
            });
            resetForm();
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template: Template) => {
        setForm({ title: template.title, content: template.content });
        setEditingId(template._id);
        setActiveCategory(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this template?")) return;
        try {
            setLoading(true);
            await deleteTemplate(id);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Message Templates</h1>

            <div className="space-y-6">
                {TEMPLATE_CATEGORIES.map((category) => {
                    const categoryTemplates = templates?.[category] || [];
                    const showForm = activeCategory === category || editingId;

                    return (
                        <div key={category} className="border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">{category}</h2>

                            </div>

                            {showForm && !editingId && activeCategory === category && (
                                <div className="mb-4 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                    <textarea
                                        placeholder="Content (use {{name}}, {{job_title}})"
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        rows={3}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSubmit(category)}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-black text-white rounded text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={resetForm}
                                            className="px-4 py-1.5 border rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {categoryTemplates.map((template) => (
                                <div key={template._id} className="mb-3 last:mb-0">
                                    {editingId === template._id ? (
                                        <div className="space-y-3 mb-3">
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                className="w-full border rounded px-3 py-2 text-sm"
                                            />
                                            <textarea
                                                value={form.content}
                                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                                rows={3}
                                                className="w-full border rounded px-3 py-2 text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSubmit(category)}
                                                    disabled={loading}
                                                    className="px-4 py-1.5 bg-black text-white rounded text-sm"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={resetForm}
                                                    className="px-4 py-1.5 border rounded text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm">{template.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                                                        {template.content}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleEdit(template)}
                                                        className="text-sm text-gray-600 hover:text-gray-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(template._id)}
                                                        className="text-sm text-gray-600 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {categoryTemplates.length === 0 && !showForm && (
                                <div className="text-center py-8 border border-dashed rounded">
                                    <p className="text-sm text-gray-500">No templates yet</p>
                                    <button
                                        onClick={() => setActiveCategory(category)}
                                        className="mt-2 text-sm text-gray-600 hover:text-gray-900 underline"
                                    >
                                        Create one
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}