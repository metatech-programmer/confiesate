import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Role, hasPermission, Permission } from '../utils/roles';
import { analytics } from '../utils/analytics';
import { useModal } from '../hooks/useModal';
import ReportModal from './common/ReportModal';

interface ConfessionCardProps {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isAnonymous: boolean;
  author?: {
    id: string;
    name: string;
  };
  hasLiked?: boolean;
  tags?: string[];
}

const ConfessionCard = ({
  id,
  content,
  createdAt,
  likesCount,
  commentsCount,
  isAnonymous,
  author,
  hasLiked,
  tags,
}: ConfessionCardProps) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const { isOpen: isReportModalOpen, openModal: openReportModal, closeModal: closeReportModal } = useModal();

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLocalLikesCount(prev => newLikeState ? prev + 1 : prev - 1);

      analytics.trackEvent({
        category: 'Interaction',
        action: newLikeState ? 'Like' : 'Unlike',
        metadata: { confessionId: id },
      });
    } catch (error) {
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLocalLikesCount(likesCount);
    }
  };

  const handleCardClick = () => {
    navigate(`/confession/${id}`);
    analytics.trackEvent({
      category: 'Navigation',
      action: 'ViewConfession',
      metadata: { confessionId: id },
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
      }
    },
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-4 cursor-pointer" onClick={handleCardClick}>
          <p className="text-gray-800 mb-4 line-clamp-4">{content}</p>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-app-purple/10 text-app-purple px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex items-center space-x-1 group"
              >
                <motion.svg
                  whileTap={{ scale: 1.2 }}
                  className={`h-5 w-5 ${
                    isLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
                  }`}
                  fill={isLiked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </motion.svg>
                <span>{localLikesCount}</span>
              </button>

              <div className="flex items-center space-x-1">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{commentsCount}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span>{new Date(createdAt).toLocaleDateString()}</span>
              {!isAnonymous && author && (
                <span className="font-medium text-app-purple">
                  {author.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
          {user && hasPermission(user.role as Role, Permission.MODERATE_POSTS) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/moderation/${id}`);
              }}
              className="text-sm text-gray-600 hover:text-app-purple"
            >
              Moderar
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              openReportModal();
            }}
            className="text-sm text-gray-600 hover:text-red-500"
          >
            Reportar
          </button>
        </div>
      </motion.div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        postId={id}
      />
    </>
  );
};

export default ConfessionCard;