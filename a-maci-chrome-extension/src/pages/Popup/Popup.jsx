import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Key,
  MessageSquare,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Revoked':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`${getStatusColor(
        status
      )} text-xs font-medium px-2 py-1 rounded-full border`}
    >
      {status}
    </span>
  );
};

const Popup = () => {
  const [activeKeypairs, setActiveKeypairs] = useState([]);
  const [showPrivateKey, setShowPrivateKey] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedKeypair, setSelectedKeypair] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [keypairName, setKeypairName] = useState('');

  const [showSignModal, setShowSignModal] = useState(false);
  const [messageToSign, setMessageToSign] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [selectedKeyForSigning, setSelectedKeyForSigning] = useState(null);

  useEffect(() => {
    // Mock data initialization
    const mockKeypairs = Array(3)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        name: `Key ${index + 1}`,
        publicKey: `ed25519_pk.${Math.random()
          .toString(36)
          .substring(2, 15)}...`,
        privateKey: `ed25519_sk.${Math.random()
          .toString(36)
          .substring(2, 15)}...`,
        status: ['Active', 'Pending', 'Revoked'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 10000000000)
          .toISOString()
          .split('T')[0],
        lastUsed: new Date(Date.now() - Math.random() * 1000000000)
          .toISOString()
          .split('T')[0],
      }));
    setActiveKeypairs(mockKeypairs);
  }, []);

  const addNotification = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleGenerateKeypair = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newKeypair = {
        id: activeKeypairs.length + 1,
        name: keypairName || `Key ${activeKeypairs.length + 1}`,
        publicKey: `ed25519_pk.${Math.random()
          .toString(36)
          .substring(2, 15)}...`,
        privateKey: `ed25519_sk.${Math.random()
          .toString(36)
          .substring(2, 15)}...`,
        status: 'Pending',
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: new Date().toISOString().split('T')[0],
      };
      setActiveKeypairs([newKeypair, ...activeKeypairs]);
      setIsGenerating(false);
      setShowGenerateModal(false);
      addNotification('New keypair generated successfully', 'success');
    }, 1500);
  };

  const handleDeleteKeypair = (id) => {
    setActiveKeypairs((prev) => prev.filter((kp) => kp.id !== id));
    setShowDeleteModal(false);
    addNotification('Keypair deleted successfully', 'success');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      addNotification('Copied to clipboard', 'success');
    } catch (err) {
      addNotification('Failed to copy to clipboard', 'error');
    }
  };

  // Add this function with your other handlers
  const handleSignMessage = () => {
    if (!selectedKeyForSigning || !messageToSign) {
      addNotification('Please select a keypair and enter a message', 'error');
      return;
    }

    const keypair = activeKeypairs.find(
      (kp) => kp.id === selectedKeyForSigning
    );

    if (keypair.status !== 'Active') {
      addNotification('Cannot sign with inactive keypair', 'error');
      return;
    }

    // Mock signing process
    setTimeout(() => {
      const signature = `${
        keypair.publicKey.split('.')[0]
      }_sig_${Date.now().toString(36)}`;
      setSignedMessage(signature);
      addNotification('Message signed successfully', 'success');
    }, 1000);
  };

  return (
    <div className="w-[350px] h-[450px] bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-semibold">A-MACI KEEPER</h1>
          <div className='flex'>
            <button
            onClick={() => setShowGenerateModal(true)}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </button>
          {/* // Add this button in your header div, after the "New Key" button */}
          <button
            onClick={() => setShowSignModal(true)}
            className="px-2 py-1 text-sm bg-green-500 text-white rounded-md flex items-center ml-2"
          >
            <MessageSquare className="w-4 h-4 mr-1" /> Sign
          </button>
          </div>
          
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {activeKeypairs.map((keypair) => (
            <div
              key={keypair.id}
              className="p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-sm">{keypair.name}</span>
                </div>
                <StatusBadge status={keypair.status} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 truncate flex-1">
                    {keypair.publicKey}
                  </div>
                  <button
                    onClick={() => copyToClipboard(keypair.publicKey)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 truncate flex-1">
                    {showPrivateKey[keypair.id]
                      ? keypair.privateKey
                      : '••••••••••••••••'}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setShowPrivateKey((prev) => ({
                          ...prev,
                          [keypair.id]: !prev[keypair.id],
                        }))
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showPrivateKey[keypair.id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedKeypair(keypair);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-2 right-2 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-md text-sm ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-72">
            <h3 className="text-lg font-semibold mb-4">Generate New Keypair</h3>
            <input
              type="text"
              placeholder="Keypair Name"
              className="w-full p-2 border rounded mb-4"
              value={keypairName}
              onChange={(e) => setKeypairName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateKeypair}
                disabled={isGenerating}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded flex items-center"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-72">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">Delete Keypair</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this keypair? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteKeypair(selectedKeypair.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showSignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-72">
            <h3 className="text-lg font-semibold mb-4">Sign Message</h3>

            <select
              className="w-full p-2 border rounded mb-2 text-sm"
              value={selectedKeyForSigning || ''}
              onChange={(e) =>
                setSelectedKeyForSigning(
                  e.target.value ? Number(e.target.value) : null
                )
              }
            >
              <option value="">Select a keypair</option>
              {activeKeypairs
                .filter((kp) => kp.status === 'Active')
                .map((kp) => (
                  <option key={kp.id} value={kp.id}>
                    {kp.name}
                  </option>
                ))}
            </select>

            <textarea
              placeholder="Enter message to sign"
              className="w-full p-2 border rounded mb-2 text-sm h-20 resize-none"
              value={messageToSign}
              onChange={(e) => setMessageToSign(e.target.value)}
            />

            {signedMessage && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Signature:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-gray-50 p-2 rounded flex-1 break-all">
                    {signedMessage}
                  </code>
                  <button
                    onClick={() => copyToClipboard(signedMessage)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowSignModal(false);
                  setMessageToSign('');
                  setSignedMessage('');
                  setSelectedKeyForSigning(null);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              <button
                onClick={handleSignMessage}
                disabled={!selectedKeyForSigning || !messageToSign}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded disabled:bg-gray-300"
              >
                Sign Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
