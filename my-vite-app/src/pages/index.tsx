// @ts-nocheck
import { button as buttonStyles } from "@nextui-org/theme";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Key,
  Plus,
  RotateCcw,
  Shield,
  Trash2,
  Download,
  Upload,
  MessageSquare,
} from "lucide-react";

const StatusDropdown = ({ status, onChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Revoked":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="inline-flex items-center">
      <select
        value={status}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        className={`${getStatusColor(status)} text-xs font-medium px-2 py-1 rounded-full border cursor-pointer transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}>
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Revoked">Revoked</option>
      </select>
    </div>
  );
};

export default function IndexPage() {
  // Enhanced state management
  const [activeKeypairs, setActiveKeypairs] = useState([]);
  const [keypairName, setKeypairName] = useState();
  const [selectedKeypair, setSelectedKeypair] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState({});
  const [messageToSign, setMessageToSign] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    backendSync: true,
    securityLevel: "High",
    lastSync: new Date().toISOString(),
    lastBackup: null,
  });

  // Add new state for active key
  const [activeKey, setActiveKey] = useState(null);

  // Add status options for the dropdown
  const STATUS_OPTIONS = ["Active", "Pending", "Revoked"];

  // Multiple modal controls
  const generateModal = useDisclosure();
  const signMessageModal = useDisclosure();
  const deleteModal = useDisclosure();
  const securityModal = useDisclosure();

  // Generate mock keypair data
  useEffect(() => {
    const mockKeypairs = Array(3)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        name: `Key ${index + 1}`,
        publicKey: `ed25519_pk.${Math.random().toString(36).substring(2, 15)}...`,
        privateKey: `ed25519_sk.${Math.random().toString(36).substring(2, 15)}...`,
        status: ["Active", "Pending", "Revoked"][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 10000000000)
          .toISOString()
          .split("T")[0],
        lastUsed: new Date(Date.now() - Math.random() * 1000000000)
          .toISOString()
          .split("T")[0],
        signatureCount: Math.floor(Math.random() * 100),
      }));
    setActiveKeypairs(mockKeypairs);
  }, []);

  // Notification system
  const addNotification = (message, type = "info") => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Update keypair click handler
  const handleKeypairClick = (keypair) => {
    setActiveKey(keypair.id);
  };

  // Enhanced keypair generation
  const handleGenerateKeypair = (name = "") => {
    setIsGenerating(true);
    setTimeout(() => {
      const newKeypair = {
        id: activeKeypairs.length + 1,
        name: name || `Key ${activeKeypairs.length + 1}`,
        publicKey: `ed25519_pk.${Math.random().toString(36).substring(2, 15)}...`,
        privateKey: `ed25519_sk.${Math.random().toString(36).substring(2, 15)}...`,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0],
        lastUsed: new Date().toISOString().split("T")[0],
        signatureCount: 0,
      };

      setActiveKeypairs([newKeypair, ...activeKeypairs]);
      setIsGenerating(false);
      generateModal.onClose();
      addNotification("New keypair generated successfully", "success");
    }, 1500);
  };

  // Delete keypair
  const handleDeleteKeypair = (id) => {
    setActiveKeypairs((prev) => prev.filter((kp) => kp.id !== id));
    addNotification("Keypair deleted successfully", "success");
    deleteModal.onClose();
  };

  // Rotate keypair
  const handleRotateKeypair = (id) => {
    setActiveKeypairs((prev) =>
      prev.map((kp) => {
        if (kp.id === id) {
          return {
            ...kp,
            publicKey: `ed25519_pk.${Math.random().toString(36).substring(2, 15)}...`,
            privateKey: `ed25519_sk.${Math.random().toString(36).substring(2, 15)}...`,
            status: "Pending",
            lastUsed: new Date().toISOString().split("T")[0],
          };
        }
        return kp;
      })
    );
    addNotification("Keypair rotated successfully", "success");
  };

  // Sign message
  // Updated handleSignMessage function
  const handleSignMessage = () => {
    // Check if we have both an active key and message
    if (!activeKey || !messageToSign) {
      addNotification("Please select a keypair and enter a message", "error");
      return;
    }

    // Find the selected keypair from activeKeypairs array
    const keypair = activeKeypairs.find((kp) => kp.id === activeKey);

    if (!keypair) {
      addNotification("Selected keypair not found", "error");
      return;
    }

    // Check if keypair is active
    if (keypair.status !== "Active") {
      addNotification("Cannot sign with inactive keypair", "error");
      return;
    }

    // Mock signing process
    setTimeout(() => {
      // Create a deterministic but random-looking signature
      const signature = `${keypair.publicKey.split(".")[0]}_sig_${Date.now().toString(36)}`;
      setSignedMessage(signature);

      // Update keypair usage statistics
      setActiveKeypairs((prev) =>
        prev.map((kp) => {
          if (kp.id === activeKey) {
            return {
              ...kp,
              lastUsed: new Date().toISOString().split("T")[0],
              signatureCount: kp.signatureCount + 1,
            };
          }
          return kp;
        })
      );

      addNotification("Message signed successfully", "success");
    }, 1000);
  };

  // Export keypair
  const handleExportKeypair = (keypair) => {
    const exportData = {
      ...keypair,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amaci-keypair-${keypair.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification("Keypair exported successfully", "success");
  };

  // Toggle private key visibility
  const togglePrivateKey = (id: string | number) => {
    setShowPrivateKey((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Active":
        return "text-green-500 bg-green-50";
      case "Pending":
        return "text-yellow-500 bg-yellow-50";
      case "Revoked":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      addNotification("Copied to clipboard", "success");
    } catch (err) {
      addNotification("Failed to copy to clipboard", "error");
    }
  };

  // Add status change handler
  const handleStatusChange = (keypairId, newStatus) => {
    setActiveKeypairs((prev) =>
      prev.map((kp) => {
        if (kp.id === keypairId) {
          return { ...kp, status: newStatus };
        }

        return kp;
      })
    );
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 lg:p-4 md:p-8 rounded-sm">
        {/* Notification System */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              className={`${notification.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
              {notification.message}
            </Alert>
          ))}
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                A-MACI KeyKeeper
              </h1>
              <p className="text-gray-600">
                Secure EdDSA Keypair Management Dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button color="primary" onPress={generateModal.onOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Generate New Keypair
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Management Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex justify-between items-center">
              <h2>Keypair Management</h2>
              <div className="space-x-2">
                <Button size="sm" variant="flat">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button size="sm" variant="flat">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {activeKeypairs.map((keypair) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <div
                    key={keypair.id}
                    className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer 
    ${activeKey === keypair.id ? "border-blue-500 border-2" : ""}`}
                    onClick={() => handleKeypairClick(keypair)}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Key className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Tooltip content="Public Key">
                                <p className="font-medium text-sm">
                                  {keypair.name} - {keypair.publicKey}
                                </p>
                              </Tooltip>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(keypair.publicKey)
                                }>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Tooltip content="Private Key">
                                <p className="text-sm text-gray-500">
                                  {showPrivateKey[keypair.id]
                                    ? keypair.privateKey
                                    : "••••••••••••••••"}
                                </p>
                              </Tooltip>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePrivateKey(keypair.id)}>
                                {showPrivateKey[keypair.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-xs text-gray-500">
                            Created: {keypair.createdAt}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last used: {keypair.lastUsed}
                          </p>
                          <p className="text-xs text-gray-500">
                            Signatures: {keypair.signatureCount}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center space-x-2">
                        <StatusDropdown
                          status={keypair.status}
                          onChange={(e) =>
                            handleStatusChange(keypair.id, e.target.value)
                          }
                        />
                        <div className="space-x-1">
                          <Button
                            size="sm"
                            variant="flat"
                            onClick={() => handleRotateKeypair(keypair.id)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onClick={() => handleExportKeypair(keypair)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={() => {
                              setSelectedKeypair(keypair);
                              deleteModal.onOpen();
                            }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <h3>Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  onPress={signMessageModal.onOpen}>
                  <FileText className="mr-2 h-4 w-4" /> Sign Message
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  onPress={() => {
                    const backup = {
                      keypairs: activeKeypairs,
                      timestamp: new Date().toISOString(),
                    };
                    handleExportKeypair(backup);
                    setSystemStatus((prev) => ({
                      ...prev,
                      lastBackup: new Date().toISOString(),
                    }));
                  }}>
                  <Download className="mr-2 h-4 w-4" /> Backup Keys
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  onPress={securityModal.onOpen}>
                  <Shield className="mr-2 h-4 w-4" /> Security Settings
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* System Status Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <h3>System Status</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Alert
                  color="success"
                  title={`
                    
                      Sync Status:
                      ${systemStatus.backendSync ? "Connected" : "Disconnected"}
                  
                  
                  `}
                />
                <Alert
                  color="primary"
                  title={`
                    
                      Security Level: ${systemStatus.securityLevel}
                  
                  
                  `}
                />

                <Alert
                  color="warning"
                  title={`
                    
                    Active Keypairs:
                    ${activeKeypairs.filter((k) => k.status === "Active").length}
                    
                    `}
                />
                <Alert
                  color="danger"
                  title={` 
                    
                    Last Backup:
                    ${
                      systemStatus.lastBackup
                        ? new Date(systemStatus.lastBackup).toLocaleDateString()
                        : "Never"
                    }
                    
                    `}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Generate Keypair Modal */}
        <Modal
          isOpen={generateModal.isOpen}
          onOpenChange={generateModal.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Generate New Keypair
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4 pt-4">
                    <Input
                      label="Keypair Name"
                      placeholder="Enter keypair name (optional)"
                      onChange={(e) => setKeypairName(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      disabled={isGenerating}
                      onPress={() => handleGenerateKeypair(keypairName)}>
                      {isGenerating ? (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Sign Message Modal */}
        <Modal
          isOpen={signMessageModal.isOpen}
          onOpenChange={signMessageModal.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Sign Message
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <p className="block text-sm font-medium text-gray-700">
                        Selected Keypair
                      </p>
                      <p>
                        {activeKeypairs.find((kp) => kp.id === activeKey)
                          ?.name || "No keypair selected"}
                      </p>
                    </div>
                    <Input
                      label="Message"
                      placeholder="Enter message to sign"
                      value={messageToSign}
                      onChange={(e) => setMessageToSign(e.target.value)}
                    />
                    {signedMessage && (
                      <div>
                        <p className="block text-sm font-medium text-gray-700">
                          Signature
                        </p>
                        <div className="mt-1 flex items-center space-x-2">
                          <code className="block p-2 bg-gray-50 rounded text-sm flex-1">
                            {signedMessage}
                          </code>
                          <Button
                            size="sm"
                            variant="flat"
                            onClick={() => copyToClipboard(signedMessage)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      disabled={!selectedKeypair || !messageToSign}
                      onPress={handleSignMessage}>
                      Sign Message
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onOpenChange={deleteModal.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete Keypair
                </ModalHeader>
                <ModalBody>
                  <Alert color="warning">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Are you sure you want to delete this keypair? This action
                    cannot be undone.
                  </Alert>
                  <p className="text-sm text-gray-600 mt-2">
                    Keypair: {selectedKeypair?.name} -{" "}
                    {selectedKeypair?.publicKey}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => handleDeleteKeypair(selectedKeypair?.id)}>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Security Settings Modal */}
        <Modal
          isOpen={securityModal.isOpen}
          onOpenChange={securityModal.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Security Settings
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <p className="block text-sm font-medium text-gray-700">
                        Security Level
                      </p>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        value={systemStatus.securityLevel}
                        onChange={(e) =>
                          setSystemStatus((prev) => ({
                            ...prev,
                            securityLevel: e.target.value,
                          }))
                        }>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <p className="block text-sm font-medium text-gray-700">
                        Auto-Lock Timeout
                      </p>
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                        <option value="5">5 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                    <Button
                      className="w-full"
                      color="primary"
                      onPress={() => {
                        addNotification("Security settings updated", "success");
                        onClose();
                      }}>
                      Save Settings
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
}
