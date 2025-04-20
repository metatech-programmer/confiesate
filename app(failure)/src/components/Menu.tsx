import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import { NotificationsBadge } from './common/NotificationsBadge';
import { useNotifications } from '../context/NotificationsContext';

export const Menu = () => {
  const { user, logout } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const { state: notificationsState, markAllAsRead, removeNotification } = useNotifications();

  const handleLogout = () => {
    logout();
    closeModal();
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Confesiones</Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={openModal}
                  className="flex items-center hover:text-gray-300"
                >
                  <span className="mr-1">Notifications</span>
                  <NotificationsBadge />
                </button>
                
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl text-gray-800 z-50">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Notifications</h3>
                        {notificationsState.notifications.length > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsState.notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-500">No notifications</p>
                      ) : (
                        notificationsState.notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-gray-50 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-300">Admin</Link>
              )}
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hover:text-gray-300">Login</Link>
              <Link to="/auth/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
