import { signOut } from '../auth-client';

const UserProfile = ({ user, onSignOut }) => {
  const handleSignOut = async () => {
    try {
      await signOut();
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.image ? (
              <img src={user.image} alt={user.name || 'User'} />
            ) : (
              <div className="avatar-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{user.name || 'User'}</h2>
            <p>{user.email}</p>
            {user.provider && (
              <span className="provider-badge">
                Signed in with {user.provider}
              </span>
            )}
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">User ID:</span>
            <span className="value">{user.id}</span>
          </div>
          {user.emailVerified && (
            <div className="detail-item">
              <span className="label">Email Status:</span>
              <span className="value verified">✓ Verified</span>
            </div>
          )}
        </div>
        
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 