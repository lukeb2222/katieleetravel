import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Star, Mail, FileText, MessageSquare, CheckCircle, XCircle, Clock, Archive, Send, X } from "lucide-react";

type Tab = "contacts" | "questionnaires" | "reviews";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("contacts");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to access the dashboard.</p>
          <a href={getLoginUrl()} className="bg-primary text-primary-foreground px-6 py-2.5 text-label text-sm">
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin permissions.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof Mail }[] = [
    { key: "contacts", label: "Contact Messages", icon: Mail },
    { key: "questionnaires", label: "Questionnaires", icon: FileText },
    { key: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-xl">Katie Lee Travel — Admin</h1>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-lg p-1 border border-border w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "contacts" && <ContactsPanel />}
        {activeTab === "questionnaires" && <QuestionnairesPanel />}
        {activeTab === "reviews" && <ReviewsPanel />}
      </div>
    </div>
  );
}

function ContactsPanel() {
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();
  const updateStatus = trpc.contact.updateStatus.useMutation();
  const sendReply = trpc.contact.reply.useMutation();
  const utils = trpc.useUtils();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleStatusChange = async (id: number, status: "new" | "read" | "replied" | "archived") => {
    await updateStatus.mutateAsync({ id, status });
    utils.contact.list.invalidate();
    toast.success("Status updated");
  };

  const handleSendReply = async (id: number, email: string, firstName: string) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    try {
      // Open the user's email client with the reply pre-filled
      const subject = encodeURIComponent(`Re: Your inquiry - Katie Lee Travel Co.`);
      const body = encodeURIComponent(`Hi ${firstName},\n\n${replyMessage}\n\nBest regards,\nKatie Lee Travel Co.`);
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
      
      // Mark as replied in the system
      await sendReply.mutateAsync({ id, email, firstName, message: replyMessage });
      utils.contact.list.invalidate();
      toast.success(`Email client opened for ${email} — status marked as replied`);
      setReplyingTo(null);
      setReplyMessage("");
    } catch {
      toast.error("Failed to update status. Please try again.");
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      {contacts && contacts.length > 0 ? (
        contacts.map((c) => (
          <div key={c.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{c.firstName} {c.lastName}</h3>
                <p className="text-sm text-muted-foreground">{c.email} {c.phone && `· ${c.phone}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  c.status === "new" ? "bg-blue-100 text-blue-700" :
                  c.status === "read" ? "bg-yellow-100 text-yellow-700" :
                  c.status === "replied" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
            {c.subject && <p className="text-sm font-medium mb-1">{c.subject}</p>}
            <p className="text-sm text-muted-foreground mb-4">{c.message}</p>

            {/* Reply Form */}
            {replyingTo === c.id && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Replying to {c.email}</p>
                  <button onClick={() => { setReplyingTo(null); setReplyMessage(""); }} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </div>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full p-3 border border-border rounded-md text-sm min-h-[100px] bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSendReply(c.id, c.email, c.firstName)}
                    disabled={sendReply.isPending}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {sendReply.isPending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
              <span className="text-muted-foreground">·</span>
              <button onClick={() => { setReplyingTo(c.id); setReplyMessage(""); }} className="text-primary hover:underline flex items-center gap-1"><Send size={12} /> Reply via Email</button>
              <button onClick={() => handleStatusChange(c.id, "read")} className="text-blue-600 hover:underline flex items-center gap-1"><Clock size={12} /> Mark Read</button>
              <button onClick={() => handleStatusChange(c.id, "archived")} className="text-gray-600 hover:underline flex items-center gap-1"><Archive size={12} /> Archive</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-center py-8">No contact submissions yet.</p>
      )}
    </div>
  );
}

function QuestionnairesPanel() {
  const { data: responses, isLoading } = trpc.questionnaire.list.useQuery();
  const updateStatus = trpc.questionnaire.updateStatus.useMutation();
  const utils = trpc.useUtils();

  const handleStatusChange = async (id: number, status: "new" | "reviewed" | "in_progress" | "completed") => {
    await updateStatus.mutateAsync({ id, status });
    utils.questionnaire.list.invalidate();
    toast.success("Status updated");
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      {responses && responses.length > 0 ? (
        responses.map((q) => (
          <div key={q.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{q.firstName} {q.lastName}</h3>
                <p className="text-sm text-muted-foreground">{q.email} {q.phone && `· ${q.phone}`}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                q.status === "new" ? "bg-blue-100 text-blue-700" :
                q.status === "reviewed" ? "bg-yellow-100 text-yellow-700" :
                q.status === "in_progress" ? "bg-purple-100 text-purple-700" :
                "bg-green-100 text-green-700"
              }`}>
                {q.status.replace("_", " ")}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
              {q.destination && <div><span className="text-muted-foreground">Destination:</span> {q.destination}</div>}
              {q.travelDates && <div><span className="text-muted-foreground">Dates:</span> {q.travelDates}</div>}
              {q.travelers && <div><span className="text-muted-foreground">Travelers:</span> {q.travelers}</div>}
              {q.budget && <div><span className="text-muted-foreground">Budget:</span> {q.budget}</div>}
              {q.occasion && <div><span className="text-muted-foreground">Occasion:</span> {q.occasion}</div>}
              {q.accommodationStyle && <div><span className="text-muted-foreground">Style:</span> {q.accommodationStyle}</div>}
            </div>
            {q.interests && <p className="text-sm mb-2"><span className="text-muted-foreground">Interests:</span> {q.interests}</p>}
            {q.additionalNotes && <p className="text-sm mb-2"><span className="text-muted-foreground">Notes:</span> {q.additionalNotes}</p>}
            <div className="flex items-center gap-2 text-xs mt-4">
              <span className="text-muted-foreground">{new Date(q.createdAt).toLocaleString()}</span>
              <span className="text-muted-foreground">·</span>
              <button onClick={() => handleStatusChange(q.id, "reviewed")} className="text-yellow-600 hover:underline">Reviewed</button>
              <button onClick={() => handleStatusChange(q.id, "in_progress")} className="text-purple-600 hover:underline">In Progress</button>
              <button onClick={() => handleStatusChange(q.id, "completed")} className="text-green-600 hover:underline">Completed</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-center py-8">No questionnaire responses yet.</p>
      )}
    </div>
  );
}

function ReviewsPanel() {
  const { data: reviews, isLoading } = trpc.reviews.list.useQuery();
  const updateStatus = trpc.reviews.updateStatus.useMutation();
  const utils = trpc.useUtils();

  const handleStatusChange = async (id: number, status: "pending" | "approved" | "rejected") => {
    await updateStatus.mutateAsync({ id, status });
    utils.reviews.list.invalidate();
    toast.success(`Review ${status}`);
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      {reviews && reviews.length > 0 ? (
        reviews.map((r) => (
          <div key={r.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.email} {r.location && `· ${r.location}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className={star <= r.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                  ))}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  r.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  r.status === "approved" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {r.status}
                </span>
              </div>
            </div>
            {r.title && <p className="text-sm font-medium mb-1">{r.title}</p>}
            <p className="text-sm text-muted-foreground mb-4">"{r.content}"</p>
            {r.destination && <p className="text-xs text-muted-foreground mb-3">Destination: {r.destination}</p>}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</span>
              <span className="text-muted-foreground">·</span>
              {r.status !== "approved" && (
                <button onClick={() => handleStatusChange(r.id, "approved")} className="text-green-600 hover:underline flex items-center gap-1">
                  <CheckCircle size={12} /> Approve
                </button>
              )}
              {r.status !== "rejected" && (
                <button onClick={() => handleStatusChange(r.id, "rejected")} className="text-red-600 hover:underline flex items-center gap-1">
                  <XCircle size={12} /> Reject
                </button>
              )}
              {r.status !== "pending" && (
                <button onClick={() => handleStatusChange(r.id, "pending")} className="text-yellow-600 hover:underline flex items-center gap-1">
                  <Clock size={12} /> Set Pending
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
      )}
    </div>
  );
}
