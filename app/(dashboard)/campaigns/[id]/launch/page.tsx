"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, Button, SuccessModal } from "@/components/ui";
import { Send, Calendar, Clock, Users, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  subject?: string;
  content?: string;
  createdAt: Date;
}

interface CampaignLeads {
  campaignId: string;
  leadIds: string[];
  importedLeads: any[];
  updatedAt: Date;
}

export default function LaunchCampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendOption, setSendOption] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleAmPm, setScheduleAmPm] = useState<"AM" | "PM">("AM");
  const [campaignData, setCampaignData] = useState<any>(null);
  const [recipientCount, setRecipientCount] = useState(0);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [sendingStatus, setSendingStatus] = useState<string>("");
  const [recipientDetails, setRecipientDetails] = useState<any[]>([]);

  // Load actual campaign data and recipients
  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        // Load campaign from localStorage
        const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
        if (savedCampaigns) {
          const campaigns = JSON.parse(savedCampaigns);
          const campaign = campaigns.find((c: Campaign) => c.id === campaignId);
          if (campaign) {
            setCampaignData(campaign);
          }
        }

        // Load campaign recipients with their contact details
        const campaignLeadsData = localStorage.getItem("blum-blast-campaign-leads");
        if (campaignLeadsData) {
          const allCampaignLeads: CampaignLeads[] = JSON.parse(campaignLeadsData);
          const thisCampaignLeads = allCampaignLeads.find(cl => cl.campaignId === campaignId);
          
          if (thisCampaignLeads) {
            setRecipientCount(thisCampaignLeads.leadIds.length);
            
            // Load actual lead details (emails and phones)
            const mockLeadsData = localStorage.getItem("blum-blast-imported-leads");
            let allLeads: any[] = [];
            
            // Get mock leads from lib
            const mockLeadsModule = await import("@/lib/mockData");
            allLeads = [...mockLeadsModule.mockLeads];
            
            // Add imported leads
            if (mockLeadsData) {
              const importedLeads = JSON.parse(mockLeadsData);
              allLeads.push(...importedLeads);
            }
            
            // Filter to get only campaign recipients
            const recipients = allLeads.filter(lead => 
              thisCampaignLeads.leadIds.includes(lead.id)
            );
            
            setRecipientDetails(recipients);
          }
        }
      } catch (e) {
        console.error("Error loading campaign data:", e);
      }
    };

    loadCampaignData();
  }, [campaignId]);

  const handleLaunch = async () => {
    setIsLaunching(true);
    setSendingProgress(0);
    
    // If scheduling for later, save schedule info and skip the sending animation
    if (sendOption === "schedule") {
      setSendingStatus("Scheduling campaign...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Save schedule information to the campaign
      try {
        const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
        if (savedCampaigns) {
          const campaigns = JSON.parse(savedCampaigns);
          const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);
          
          if (campaignIndex !== -1) {
            // Update campaign with schedule info
            campaigns[campaignIndex] = {
              ...campaigns[campaignIndex],
              status: 'scheduled',
              scheduledDate: scheduleDate,
              scheduledTime: scheduleTime,
              scheduledAmPm: scheduleAmPm,
              scheduledFor: `${scheduleDate} ${scheduleTime} ${scheduleAmPm}`,
            };
            
            localStorage.setItem("blum-blast-campaigns", JSON.stringify(campaigns));
          }
        }
      } catch (e) {
        console.error("Error saving schedule:", e);
      }
      
      console.log("\n📅 ========================================");
      console.log("🗓️  CAMPAIGN SCHEDULED");
      console.log("==========================================");
      console.log(`Campaign: ${campaignData.name}`);
      console.log(`Channel: ${campaignData.channel.toUpperCase()}`);
      console.log(`Scheduled Date: ${new Date(scheduleDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`);
      console.log(`Scheduled Time: ${scheduleTime} ${scheduleAmPm}`);
      console.log(`Total Recipients: ${recipientDetails.length}`);
      console.log("==========================================\n");
      
      setIsLaunching(false);
      setShowSuccessModal(true);
      return;
    }
    
    // For "Send Now" - save as sent and show the full sending animation
    setSendingStatus("Initializing campaign...");
    
    // Show initialization
    console.log("\n🚀 ========================================");
    console.log("📢 CAMPAIGN LAUNCH STARTED");
    console.log("==========================================");
    console.log(`Campaign: ${campaignData.name}`);
    console.log(`Channel: ${campaignData.channel.toUpperCase()}`);
    console.log(`Total Recipients: ${recipientDetails.length}`);
    console.log("==========================================\n");
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const totalRecipients = recipientDetails.length;
    let sent = 0;
    
    // Minimum time per recipient for demo visibility (2 seconds each)
    const delayPerRecipient = 2000;
    
    setSendingStatus("Connecting to email/SMS servers...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    for (let i = 0; i < totalRecipients; i++) {
      const recipient = recipientDetails[i];
      
      // Show detailed progress for each recipient
      if (campaignData.channel === 'email' || campaignData.channel === 'both') {
        setSendingStatus(`📧 Sending email to ${recipient.firstName} ${recipient.lastName}...`);
        console.log(`\n📧 EMAIL #${i + 1}/${totalRecipients}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`To: ${recipient.email}`);
        console.log(`Name: ${recipient.firstName} ${recipient.lastName}`);
        console.log(`Company: ${recipient.company || 'N/A'}`);
        console.log(`Subject: ${campaignData.subject}`);
        console.log(`Preview: ${campaignData.content?.substring(0, 80)}...`);
        console.log(`Status: ✅ SENT`);
        
        // Simulate email sending progress
        await new Promise((resolve) => setTimeout(resolve, delayPerRecipient / 2));
      }
      
      if (campaignData.channel === 'sms' || campaignData.channel === 'both') {
        setSendingStatus(`📱 Sending SMS to ${recipient.firstName} ${recipient.lastName}...`);
        console.log(`\n📱 SMS #${i + 1}/${totalRecipients}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`To: ${recipient.phone || 'No phone number'}`);
        console.log(`Name: ${recipient.firstName} ${recipient.lastName}`);
        console.log(`Message: ${campaignData.content?.substring(0, 80)}...`);
        console.log(`Status: ${recipient.phone ? '✅ SENT' : '❌ SKIPPED (no phone)'}`);
        
        // Simulate SMS sending progress
        await new Promise((resolve) => setTimeout(resolve, delayPerRecipient / 2));
      }
      
      sent++;
      const progress = Math.round((sent / totalRecipients) * 100);
      setSendingProgress(progress);
      setSendingStatus(`Sent to ${sent} of ${totalRecipients} recipients...`);
    }
    
    setSendingStatus("✅ Campaign sent successfully!");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Save campaign as sent
    try {
      const savedCampaigns = localStorage.getItem("blum-blast-campaigns");
      if (savedCampaigns) {
        const campaigns = JSON.parse(savedCampaigns);
        const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);
        
        if (campaignIndex !== -1) {
          campaigns[campaignIndex] = {
            ...campaigns[campaignIndex],
            status: 'sent',
            sentAt: new Date().toISOString(),
          };
          
          localStorage.setItem("blum-blast-campaigns", JSON.stringify(campaigns));
        }
      }
    } catch (e) {
      console.error("Error saving sent status:", e);
    }
    
    // Log final summary
    console.log("\n\n✅ ========================================");
    console.log("🎉 CAMPAIGN SENT SUCCESSFULLY");
    console.log("==========================================");
    console.log(`Campaign Name: ${campaignData.name}`);
    console.log(`Channel: ${campaignData.channel.toUpperCase()}`);
    console.log(`Total Recipients: ${totalRecipients}`);
    console.log(`Successfully Sent: ${sent}`);
    console.log(`Success Rate: 100%`);
    console.log("==========================================");
    console.log("\n📋 RECIPIENTS SUMMARY:");
    recipientDetails.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.firstName} ${r.lastName}`);
      if (campaignData.channel === 'email' || campaignData.channel === 'both') {
        console.log(`   ✉️  ${r.email}`);
      }
      if (campaignData.channel === 'sms' || campaignData.channel === 'both') {
        console.log(`   📱 ${r.phone || 'N/A'}`);
      }
      console.log(`   🏢 ${r.company || 'N/A'}`);
    });
    console.log("\n==========================================\n");
    
    setIsLaunching(false);
    setShowSuccessModal(true);
  };

  if (!campaignData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading campaign...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Launch Campaign</h1>
          <p className="mt-1 text-gray-600">Step 3: Review and send your campaign</p>
        </div>
      </div>

      {/* Campaign Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Campaign Name</p>
              <p className="font-semibold text-gray-900">{campaignData.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recipients</p>
              <p className="font-semibold text-gray-900">{recipientCount} leads</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Send className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Channel</p>
              <p className="font-semibold text-gray-900 capitalize">{campaignData.channel}</p>
            </div>
          </div>
          {campaignData.subject && (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold text-gray-900">{campaignData.subject}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Send Options */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">When to Send</h3>
        <div className="space-y-3">
          <div
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              sendOption === "now"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSendOption("now")}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={sendOption === "now"}
                onChange={() => setSendOption("now")}
                className="h-4 w-4"
              />
              <Send className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Send Immediately</p>
                <p className="text-sm text-gray-600">Campaign will be sent right away to all recipients</p>
              </div>
            </div>
          </div>

          <div
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              sendOption === "schedule"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSendOption("schedule")}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={sendOption === "schedule"}
                onChange={() => setSendOption("schedule")}
                className="h-4 w-4"
              />
              <Calendar className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Schedule for Later</p>
                <p className="text-sm text-gray-600">Choose a specific date and time</p>
                {sendOption === "schedule" && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Time Picker with AM/PM */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={scheduleAmPm}
                          onChange={(e) => setScheduleAmPm(e.target.value as "AM" | "PM")}
                          className="w-16 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    {scheduleDate && (
                      <div className="col-span-2 rounded-lg bg-purple-50 border border-purple-200 px-3 py-2">
                        <p className="text-xs font-medium text-purple-900">
                          📅 {new Date(scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {scheduleTime} {scheduleAmPm}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pre-Launch Checklist */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Pre-Launch Checklist</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">Campaign content created</span>
          </div>
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">{recipientCount} leads added</span>
          </div>
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">All required fields validated</span>
          </div>
        </div>
      </Card>

      {/* Warning */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-semibold text-yellow-900">Important</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Once launched, this campaign will be sent to {recipientCount} recipients. 
              {sendOption === "now" 
                ? " Sending will begin immediately." 
                : " Sending will begin at the scheduled time."}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card>
        <div className="flex items-center justify-between">
          <Link href={`/campaigns/${campaignId}/import-leads`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="flex gap-3">
            <Link href="/campaigns">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button
              variant="primary"
              onClick={handleLaunch}
              isLoading={isLaunching}
              disabled={sendOption === "schedule" && (!scheduleDate || !scheduleTime)}
            >
              <Send className="h-4 w-4 mr-2" />
              {sendOption === "now" ? "Launch Campaign" : "Schedule Campaign"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Sending Progress - Only for "Send Now" */}
      {isLaunching && sendOption === "now" && (
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Send className="h-7 w-7 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900">🚀 Sending Campaign...</h3>
                <p className="text-sm font-medium text-blue-700 mt-1">{sendingStatus}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-900">Progress</span>
                <span className="text-2xl font-bold text-blue-900">{sendingProgress}%</span>
              </div>
              <div className="h-6 overflow-hidden rounded-full bg-blue-200 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${sendingProgress}%` }}
                >
                  {sendingProgress > 10 && (
                    <span className="text-xs font-bold text-white">
                      {Math.round((sendingProgress / 100) * recipientCount)} / {recipientCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                💡 Demo Mode - Real-Time Simulation
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ Watch the progress bar fill up as each recipient is processed</li>
                <li>✓ Open browser console (F12) to see detailed sending logs</li>
                <li>✓ Real email addresses and phone numbers are being "sent" to</li>
                <li>✓ In production, this will connect to your email/SMS provider</li>
              </ul>
            </div>
            
            {recipientCount > 0 && (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Recipients ({recipientCount}):</p>
                <div className="flex flex-wrap gap-2">
                  {recipientDetails.slice(0, 5).map((r, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {r.firstName} {r.lastName}
                    </span>
                  ))}
                  {recipientCount > 5 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      +{recipientCount - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Scheduling Progress - Only for "Schedule for Later" */}
      {isLaunching && sendOption === "schedule" && (
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Calendar className="h-7 w-7 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900">📅 Scheduling Campaign...</h3>
                <p className="text-sm font-medium text-purple-700 mt-1">{sendingStatus}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                🗓️ Schedule Details
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>✓ Campaign will be sent on {new Date(scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</li>
                <li>✓ Time: {scheduleTime} {scheduleAmPm}</li>
                <li>✓ Recipients: {recipientCount} leads</li>
                <li>✓ Check browser console (F12) for schedule confirmation</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={sendOption === "now" ? "Campaign Launched Successfully!" : "Campaign Scheduled Successfully!"}
        message={
          sendOption === "now"
            ? `Your campaign has been sent to ${recipientCount} recipients. You can track performance in real-time.`
            : `Your campaign has been scheduled and will be sent on ${new Date(scheduleDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at ${scheduleTime} ${scheduleAmPm}.`
        }
        nextAction={{
          label: "View Analytics",
          href: `/campaigns/${campaignId}/analytics`,
        }}
        secondaryAction={{
          label: "Back to Campaigns",
          href: `/campaigns`,
        }}
      />
    </div>
  );
}
