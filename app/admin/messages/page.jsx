"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Trash2,
  RefreshCw,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async (page = 1, search = "", status = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(status && { status }),
      });

      const response = await fetch(`/api/admin/messages?${params}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data.messages);
        setCurrentPage(data.data.page);
        setTotalPages(data.data.pages);
        setTotal(data.data.total);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      setDeleteLoading(true);
      const response = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageIds: [messageId] }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
        fetchMessages(currentPage, searchTerm, statusFilter);
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(null);
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Message status updated successfully",
        });
        fetchMessages(currentPage, searchTerm, statusFilter);
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(data.data);
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update message status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  const handleExportMessages = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Subject", "Message", "Status", "Created At"].join(","),
      ...messages.map((message) => [
        `"${message.name}"`,
        message.email,
        message.phone || "",
        message.subject,
        `"${message.message.replace(/"/g, '""')}"`,
        message.status,
        new Date(message.createdAt).toLocaleDateString(),
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "messages.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: "Message data exported to CSV",
    });
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchMessages(1, searchTerm, statusFilter);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const sortedMessages = [...messages].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "email-asc":
        return a.email.localeCompare(b.email);
      case "email-desc":
        return b.email.localeCompare(a.email);
      default:
        return 0;
    }
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchMessages(newPage, searchTerm, statusFilter);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchMessages(newPage, searchTerm, statusFilter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Manage and view customer messages</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => fetchMessages(currentPage, searchTerm, statusFilter)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportMessages}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages by name, email, or content..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                      <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 transition-colors">
                          <th className="h-10 px-4 text-left font-medium">Sender</th>
                          <th className="h-10 px-4 text-left font-medium">Subject</th>
                          <th className="h-10 px-4 text-left font-medium">Status</th>
                          <th className="h-10 px-4 text-left font-medium">Created At</th>
                          <th className="h-10 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="p-4 text-center text-muted-foreground">
                              <RefreshCw className="mx-auto h-4 w-4 animate-spin" />
                              Loading messages...
                            </td>
                          </tr>
                        ) : sortedMessages.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-4 text-center text-muted-foreground">
                              No messages found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          sortedMessages.map((message) => (
                            <tr
                              key={message._id}
                              className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                              onClick={() => setSelectedMessage(message)}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {message.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{message.name}</div>
                                    <div className="text-sm text-muted-foreground">{message.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 capitalize">{message.subject}</td>
                              <td className="p-4">
                                <Badge variant="outline" className="capitalize">
                                  {message.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    {/* <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `mailto:${message.email}`;
                                      }}
                                    >
                                      <Mail className="mr-2 h-4 w-4" />
                                      Reply
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMessage(message);
                                      }}
                                    >
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={(e) => e.stopPropagation()}
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete Message
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete this message from {message.name}? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => deleteMessage(message._id)}
                                            className="bg-red-600 hover:bg-red-700"
                                            disabled={deleteLoading}
                                          >
                                            {deleteLoading ? "Deleting..." : "Delete"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{messages.length}</strong> of <strong>{total}</strong> messages
                    {totalPages > 1 && (
                      <span> (Page {currentPage} of {totalPages})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          {selectedMessage ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Message Details</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => (window.location.href = `mailto:${selectedMessage.email}`)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateMessageStatus(selectedMessage._id, 'responded')}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Mark as Responded
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateMessageStatus(selectedMessage._id, 'closed')}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Mark as Closed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Message
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Message</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this message from {selectedMessage.name}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMessage(selectedMessage._id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>ID: {selectedMessage._id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">
                      {selectedMessage.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{selectedMessage.name}</h3>
                    <Badge variant="outline" className="capitalize">
                      {selectedMessage.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Subject: {selectedMessage.subject}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Received: {new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedMessage.updatedAt && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Updated: {new Date(selectedMessage.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Tabs defaultValue="message" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Message</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="message" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Message Content</h4>
                      <p className="text-sm text-gray-600">{selectedMessage.message}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Message Details</h4>
                      <div className="text-sm space-y-1">
                        <div><strong>Name:</strong> {selectedMessage.name}</div>
                        <div><strong>Email:</strong> {selectedMessage.email}</div>
                        {selectedMessage.phone && (
                          <div><strong>Phone:</strong> {selectedMessage.phone}</div>
                        )}
                        <div><strong>Subject:</strong> {selectedMessage.subject}</div>
                        <div><strong>Status:</strong> {selectedMessage.status}</div>
                        <div><strong>ID:</strong> {selectedMessage._id}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
                <CardDescription>Select a message to view details</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[400px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No message selected</p>
                  <p className="text-sm">Click on a message from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}