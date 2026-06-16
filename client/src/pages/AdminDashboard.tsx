import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Star, Mail, FileText, MessageSquare, CheckCircle, XCircle, Clock, Archive, Send, X, Lock } from "lucide-react";

type Tab = "contacts" | "questionnaires" | "reviews";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("contacts");
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("admin_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_key"));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_key", keyInput);
    setAdminKey(keyInput);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm w-full px-6">
          <Lock className="mx-auto mb-4 text-primary" size={32} strokeWidth={1.5} />
          <h1 className="font-serif text-2xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mb-6">Enter admin password to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-2.5 border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-2.5 text-label text-sm hover:bg-primary/90 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl">Katie Lee Travel — Admin</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_key");
              setAuthenticated(false);
              setAdminKey("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-6">
        <div className="flex gap-2 mb-8">
          {([
            { id: "contacts" as Tab, label: "Contact Messages", icon: Mail },
            { id: "questionnaires" as Tab, label: "Questionnaires", icon: FileText },
            { id: "reviews" as Tab, label: "Reviews", icon: MessageSquare },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded transition-colors ${
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-foreground/70 hover:bg-secondary"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "contacts" && <ContactsPanel adminKey={adminKey} />}
        {activeTab === "questionnaires" && <QuestionnairesPanel adminKey={adminKey} />}
        {activeTab === "reviews" && <ReviewsPanel adminKey={adminKey} />}
      </div>
    </div>
  );
}

function ContactsPanel({ adminKey }: { adminKey: string }) {
  const { data: contacts, isLoading, error } = trpc.contact.list.useQuery(undefined, {
    retry: false,
  });
  const updateStatus = trpc.contact.updateStatus.useMutation();
  const utils = trpc.useUtils();

  if (isLoading) return <p className="text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Access denied. Check your admin password.</p>;
  if (!contacts || contacts.length === 0) return <p className="text-center text-muted-foreground">No contact submissions yet.</p>;

  return (
    <div className="space-y-4">
      {contacts.map((c: any) => (
        <div key={c.id} className="bg-white border border-border p-5 rounded">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium">{c.firstName} {c.lastName}</h3>
              <p className="text-sm text-muted-foreground">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              c.status === "new" ? "bg-blue-100 text-blue-700" :
              c.status === "read" ? "bg-yellow-100 text-yellow-700" :
              c.status === "replied" ? "bg-green-100 text-green-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {c.status}
            </span>
          </div>
          {c.subject && <p className="text-sm font-medium mb-1">{c.subject}</p>}
          <p className="text-sm text-muted-foreground mb-3">{c.message}</p>
          <div className="flex gap-2">
            <a
              href={`mailto:${c.email}?subject=Re: ${c.subject || "Your inquiry"}&body=Hi ${c.firstName},%0D%0A%0D%0A`}
              className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded flex items-center gap-1 hover:bg-primary/90 transition-colors"
              onClick={() => {
                updateStatus.mutate({ id: c.id, status: "replied" }, {
                  onSuccess: () => utils.contact.list.invalidate(),
                });
              }}
            >
              <Send size={12} /> Reply via Email
            </a>
            {c.status === "new" && (
              <button
                onClick={() => updateStatus.mutate({ id: c.id, status: "read" }, {
                  onSuccess: () => utils.contact.list.invalidate(),
                })}
                className="text-xs bg-secondary text-foreground/70 px-3 py-1.5 rounded hover:bg-secondary/80 transition-colors"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={() => updateStatus.mutate({ id: c.id, status: "archived" }, {
                onSuccess: () => utils.contact.list.invalidate(),
              })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              <Archive size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionnairesPanel({ adminKey }: { adminKey: string }) {
  const { data: questionnaires, isLoading, error } = trpc.questionnaire.list.useQuery(undefined, {
    retry: false,
  });
  const updateStatus = trpc.questionnaire.updateStatus.useMutation();
  const utils = trpc.useUtils();

  if (isLoading) return <p className="text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Access denied. Check your admin password.</p>;
  if (!questionnaires || questionnaires.length === 0) return <p className="text-center text-muted-foreground">No questionnaire responses yet.</p>;

  return (
    <div className="space-y-4">
      {questionnaires.map((q: any) => (
        <div key={q.id} className="bg-white border border-border p-5 rounded">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium">{q.firstName} {q.lastName}</h3>
              <p className="text-sm text-muted-foreground">{q.email}{q.phone ? ` · ${q.phone}` : ""}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              q.status === "new" ? "bg-blue-100 text-blue-700" :
              q.status === "reviewed" ? "bg-yellow-100 text-yellow-700" :
              q.status === "in_progress" ? "bg-purple-100 text-purple-700" :
              "bg-green-100 text-green-700"
            }`}>
              {q.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {q.destination && <p><span className="text-muted-foreground">Destination:</span> {q.destination}</p>}
            {q.travelDates && <p><span className="text-muted-foreground">Dates:</span> {q.travelDates}</p>}
            {q.travelers && <p><span className="text-muted-foreground">Travelers:</span> {q.travelers}</p>}
            {q.budget && <p><span className="text-muted-foreground">Budget:</span> {q.budget}</p>}
            {q.occasion && <p><span className="text-muted-foreground">Occasion:</span> {q.occasion}</p>}
            {q.accommodationStyle && <p><span className="text-muted-foreground">Accommodation:</span> {q.accommodationStyle}</p>}
            {q.interests && <p><span className="text-muted-foreground">Interests:</span> {q.interests}</p>}
            {q.dietaryNeeds && <p><span className="text-muted-foreground">Dietary:</span> {q.dietaryNeeds}</p>}
            {q.mobilityNeeds && <p><span className="text-muted-foreground">Mobility:</span> {q.mobilityNeeds}</p>}
          </div>
          {q.additionalNotes && <p className="text-sm mt-2 text-muted-foreground italic">"{q.additionalNotes}"</p>}
          <div className="flex gap-2 mt-3">
            <select
              value={q.status}
              onChange={(e) => updateStatus.mutate(
                { id: q.id, status: e.target.value as any },
                { onSuccess: () => utils.questionnaire.list.invalidate() }
              )}
              className="text-xs border border-border px-2 py-1 rounded bg-white"
            >
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <a
              href={`mailto:${q.email}?subject=Your Travel Questionnaire&body=Hi ${q.firstName},%0D%0A%0D%0AThank you for submitting your travel questionnaire!%0D%0A%0D%0A`}
              className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded flex items-center gap-1 hover:bg-primary/90 transition-colors"
            >
              <Send size={12} /> Email Client
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsPanel({ adminKey }: { adminKey: string }) {
  const { data: reviews, isLoading, error } = trpc.reviews.list.useQuery(undefined, {
    retry: false,
  });
  const updateStatus = trpc.reviews.updateStatus.useMutation();
  const utils = trpc.useUtils();

  if (isLoading) return <p className="text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Access denied. Check your admin password.</p>;
  if (!reviews || reviews.length === 0) return <p className="text-center text-muted-foreground">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((r: any) => (
        <div key={r.id} className="bg-white border border-border p-5 rounded">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-medium">{r.name}</span>
              </div>
              {r.title && <p className="text-sm font-medium">{r.title}</p>}
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              r.status === "pending" ? "bg-yellow-100 text-yellow-700" :
              r.status === "approved" ? "bg-green-100 text-green-700" :
              "bg-red-100 text-red-700"
            }`}>
              {r.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">"{r.content}"</p>
          {r.destination && <p className="text-xs text-muted-foreground mb-3">Destination: {r.destination}</p>}
          <div className="flex gap-2">
            {r.status !== "approved" && (
              <button
                onClick={() => updateStatus.mutate({ id: r.id, status: "approved" }, {
                  onSuccess: () => {
                    utils.reviews.list.invalidate();
                    toast.success("Review approved");
                  },
                })}
                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={12} /> Approve
              </button>
            )}
            {r.status !== "rejected" && (
              <button
                onClick={() => updateStatus.mutate({ id: r.id, status: "rejected" }, {
                  onSuccess: () => {
                    utils.reviews.list.invalidate();
                    toast.success("Review rejected");
                  },
                })}
                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-700 transition-colors"
              >
                <XCircle size={12} /> Reject
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
