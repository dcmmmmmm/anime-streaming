// Import các thư viện cần thiết
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho bình luận
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

// Props cho component CommentSection
interface CommentSectionProps {
  episodeId: string;
}

export default function CommentSection({ episodeId }: CommentSectionProps) {
  // Lấy thông tin người dùng đang đăng nhập
  const { data: session } = useSession();

  // Các state quản lý dữ liệu và trạng thái
  const [comments, setComments] = useState<Comment[]>([]); // Danh sách bình luận
  const [newComment, setNewComment] = useState(""); // Nội dung bình luận mới
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gửi bình luận
  const [editingComment, setEditingComment] = useState<string | null>(null); // ID bình luận đang chỉnh sửa
  const [editContent, setEditContent] = useState(""); // Nội dung đang chỉnh sửa

  // Hàm lấy danh sách bình luận từ server
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?episodeId=${episodeId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Lỗi không lấy được dữ liệu", error);
    }
  };

  // Gọi API lấy bình luận khi component mount hoặc episodeId thay đổi
  useEffect(() => {
    fetchComments();
  }, [episodeId]);

  // Xử lý thêm bình luận mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra đăng nhập
    if (!session) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }

    // Kiểm tra nội dung rỗng
    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi API thêm bình luận
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          episodeId,
        }),
      });

      if (!res.ok) throw new Error("Lỗi thêm bình luận");

      // Cập nhật state khi thêm thành công
      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Đã thêm bình luận!");
    } catch (error) {
      toast.error("Không thể thêm bình luận!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý xóa bình luận
  const handleDelete = async (commentId: string) => {
    // Xác nhận trước khi xóa
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      // Gọi API xóa bình luận
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Lỗi xóa bình luận");
      }

      // Cập nhật state sau khi xóa
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
      toast.success("Đã xóa bình luận!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Không thể xóa bình luận!");
    }
  };

  // Chuẩn bị chỉnh sửa bình luận
  const handleEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // Xử lý cập nhật bình luận
  const handleUpdate = async (commentId: string) => {
    // Kiểm tra nội dung rỗng
    if (!editContent.trim()) {
      toast.error("Nội dung bình luận không được để trống!");
      return;
    }

    try {
      // Gọi API cập nhật bình luận
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content: editContent.trim() 
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Lỗi cập nhật bình luận");
      }

      // Cập nhật state sau khi sửa thành công
      const updatedComment = await res.json();
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      
      // Reset trạng thái chỉnh sửa
      setEditingComment(null);
      setEditContent("");
      toast.success("Đã cập nhật bình luận!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Không thể cập nhật bình luận!");
    }
  };

  // Hủy chỉnh sửa bình luận
  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  // Hiển thị thông báo nếu chưa đăng nhập
  if(!session) {
    return(
      <div className="text-center py-4">
        <p>Bạn phải đăng nhập mới được bình luận</p>
      </div>
    )
  }

  // UI của component
  return (
    
    <div className="bg-[#29223a] p-4 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold mb-4">Bình luận</h3>
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={session ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận"}
          disabled={!session || isSubmitting}
          className="bg-[#303953] border-none resize-none mb-2"
          rows={3}
        />
        {session && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#ff025b] hover:bg-[#d8064b]"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
          </Button>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#303953] p-4 rounded">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src={comment.user.image || "https://randomuser.me/api/portraits/lego/8.jpg"}
                  alt={comment.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{comment.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {session?.user?.id === comment.userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 hover:bg-gray-700 rounded text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {editingComment === comment.id ? (
              <div className="mt-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-[#303953] border-none resize-none mb-2"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(comment.id)}
                    className="bg-[#ff025b] hover:bg-[#d8064b]"
                  >
                    Cập nhật
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="bg-transparent"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-200">{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}