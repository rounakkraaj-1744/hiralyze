"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Briefcase, Users, MessageSquare, Settings, Bell, Shield, Globe, Trash2 } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    jobAlerts: true,
    messageAlerts: true,
    applicationUpdates: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">HR</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">HR Portal</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/talent-manager"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/talent-manager/jobs"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Briefcase className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/talent-manager/candidates"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Users className="h-5 w-5" />
              <span>Candidates</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 bg-green-100 text-green-700 rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/post-job">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full">Post a job</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Job Alerts</Label>
                        <p className="text-sm text-gray-600">Get notified about new job opportunities</p>
                      </div>
                      <Switch
                        checked={notifications.jobAlerts}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, jobAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Message Alerts</Label>
                        <p className="text-sm text-gray-600">Get notified about new messages</p>
                      </div>
                      <Switch
                        checked={notifications.messageAlerts}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, messageAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Application Updates</Label>
                        <p className="text-sm text-gray-600">Get notified about application status changes</p>
                      </div>
                      <Switch
                        checked={notifications.applicationUpdates}
                        onCheckedChange={(checked: any) =>
                          setNotifications({ ...notifications, applicationUpdates: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button className="bg-green-500 hover:bg-green-600">Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Profile Visibility</Label>
                      <Select
                        value={privacy.profileVisibility}
                        onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Visible to everyone</SelectItem>
                          <SelectItem value="recruiters">Recruiters only</SelectItem>
                          <SelectItem value="private">Private - Only you</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Show Email Address</Label>
                        <p className="text-sm text-gray-600">Allow others to see your email</p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked: any) => setPrivacy({ ...privacy, showEmail: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Show Phone Number</Label>
                        <p className="text-sm text-gray-600">Allow others to see your phone number</p>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked: any) => setPrivacy({ ...privacy, showPhone: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Allow Messages</Label>
                        <p className="text-sm text-gray-600">Allow recruiters to message you</p>
                      </div>
                      <Switch
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked: any) => setPrivacy({ ...privacy, allowMessages: checked })}
                      />
                    </div>
                  </div>

                  <Button className="bg-green-500 hover:bg-green-600">Save Privacy Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="pst">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">Pacific Standard Time</SelectItem>
                          <SelectItem value="est">Eastern Standard Time</SelectItem>
                          <SelectItem value="cst">Central Standard Time</SelectItem>
                          <SelectItem value="mst">Mountain Standard Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Connected Accounts</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-medium">LI</span>
                          </div>
                          <div>
                            <p className="font-medium">LinkedIn</p>
                            <p className="text-sm text-gray-600">Connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                            <span className="text-red-600 text-xs font-medium">G</span>
                          </div>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-sm text-gray-600">Connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-green-500 hover:bg-green-600">Save Account Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Enable 2FA</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
                    <div className="border border-red-200 rounded-md p-4 bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium text-red-900">Delete Account</Label>
                          <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-green-500 hover:bg-green-600">Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}