import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
} from 'next-share';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface ShareButtonProps {
  title: string;
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, url }) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã sao chép đường dẫn vào clipboard!");
    } catch (error) {
      console.error('Lỗi khi sao chép:', error);
      toast.error("Có lỗi xảy ra khi sao chép!");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Button
        onClick={handleCopyLink}
        className="
          bg-teal-500 hover:bg-teal-600  
          flex items-center justify-center gap-2
          px-4 py-6
          text-white font-medium
          rounded-lg
          shadow-lg hover:shadow-xl
          transform hover:-translate-y-0.5
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
        title="Sao chép liên kết"
      >
        📤 Sao chép
      </Button>

      <div className="flex items-center gap-3">
        <FacebookShareButton 
          url={url} 
          quote={title}
          className="transform hover:-translate-y-1 transition-transform duration-200"
        >
          <FacebookIcon 
            size={40} 
            round 
            className="hover:shadow-lg transition-shadow duration-200"
          />
        </FacebookShareButton>

        <TwitterShareButton 
          url={url} 
          title={title}
          className="transform hover:-translate-y-1 transition-transform duration-200"
        >
          <TwitterIcon 
            size={40} 
            round 
            className="hover:shadow-lg transition-shadow duration-200"
          />
        </TwitterShareButton>

        <TelegramShareButton 
          url={url} 
          title={title}
          className="transform hover:-translate-y-1 transition-transform duration-200"
        >
          <TelegramIcon 
            size={40} 
            round 
            className="hover:shadow-lg transition-shadow duration-200"
          />
        </TelegramShareButton>

        <WhatsappShareButton 
          url={url} 
          title={title}
          className="transform hover:-translate-y-1 transition-transform duration-200"
        >
          <WhatsappIcon 
            size={40} 
            round 
            className="hover:shadow-lg transition-shadow duration-200"
          />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ShareButton; 