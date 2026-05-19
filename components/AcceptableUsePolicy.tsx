import React, { useState } from 'react';
import { Shield, FileText, Scale, Lock, X, ExternalLink } from 'lucide-react';

type PolicyTab = 'terms' | 'privacy' | 'dmca' | 'acceptable-use';

interface AcceptableUsePolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs: { id: PolicyTab; label: string; icon: React.ReactNode }[] = [
  { id: 'acceptable-use', label: 'Acceptable Use', icon: <Shield className="w-4 h-4" /> },
  { id: 'terms', label: 'Terms of Service', icon: <Scale className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
  { id: 'dmca', label: 'DMCA Policy', icon: <FileText className="w-4 h-4" /> },
];

const AcceptableUsePolicy: React.FC<AcceptableUsePolicyProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>('acceptable-use');

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'acceptable-use':
        return (
          <div className="space-y-4 text-sm text-[#888] leading-relaxed">
            <h3 className="text-lg font-bold text-white">Acceptable Use Policy</h3>
            <p className="text-[#666]">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="p-4 bg-amber-900/20 border border-amber-800/30 rounded-lg">
              <p className="text-amber-300 font-medium text-xs uppercase tracking-wider mb-1">Our Commitment</p>
              <p className="text-sm">
                ClipForge AI is an AI content transformation platform. We are committed to 
                helping creators transform, enhance, and repurpose content they own or have 
                permission to use. We do not condone or support copyright infringement.
              </p>
            </div>

            <h4 className="font-bold text-white mt-4">✅ Permitted Uses</h4>
            <ul className="space-y-2 pl-4">
              {[
                'Transforming your own original content',
                'Enhancing content you have created yourself',
                'Repurposing content you have a license or permission to use',
                'Creating AI-assisted edits of your own work',
                'Adding captions, translations, or summaries to your content',
                'Remixing content you own the rights to',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-white mt-4">❌ Prohibited Uses</h4>
            <ul className="space-y-2 pl-4">
              {[
                'Downloading or copying content from streaming platforms (Netflix, YouTube, TikTok, etc.)',
                'Removing watermarks, logos, copyright notices, or ownership marks',
                'Creating unauthorized copies of copyrighted characters or media',
                'Cloning voices or identities without consent',
                'Mass reproducing copyrighted material for redistribution',
                'Bypassing DRM, platform protections, or access controls',
                'Uploading or reposting content you do not own or have permission to use',
                'Creating misleading or deceptive content that impersonates others',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-white mt-4">Enforcement</h4>
            <p>
              Violations of this policy may result in warnings, feature restrictions, or 
              suspension of access. We actively monitor for abuse and respond to copyright 
              takedown requests in accordance with applicable laws.
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4 text-sm text-[#888] leading-relaxed">
            <h3 className="text-lg font-bold text-white">Terms of Service</h3>
            <p className="text-[#666]">Last updated: {new Date().toLocaleDateString()}</p>

            <h4 className="font-bold text-white mt-4">1. Acceptance of Terms</h4>
            <p>
              By using ClipForge AI ("the Service"), you agree to these Terms of Service. 
              If you do not agree, do not use the Service.
            </p>

            <h4 className="font-bold text-white mt-4">2. User Responsibilities</h4>
            <p>
              You are solely responsible for all content you upload, process, or generate 
              using the Service. You must have the necessary rights, licenses, or permissions 
              for any content you use with the Service.
            </p>

            <h4 className="font-bold text-white mt-4">3. Acceptable Use</h4>
            <p>
              You agree to use the Service in accordance with our Acceptable Use Policy. 
              You may not use the Service for any illegal purpose or in violation of 
              applicable copyright laws.
            </p>

            <h4 className="font-bold text-white mt-4">4. Intellectual Property</h4>
            <p>
              You retain ownership of your original content. By using the Service, you grant 
              us a limited license to process your content solely for the purpose of providing 
              the Service. We do not claim ownership over AI-generated outputs.
            </p>

            <h4 className="font-bold text-white mt-4">5. Limitation of Liability</h4>
            <p>
              The Service is provided "as is" without warranties of any kind. We are not 
              liable for any damages arising from your use of the Service. You use AI 
              generation features at your own discretion.
            </p>

            <h4 className="font-bold text-white mt-4">6. Changes to Terms</h4>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the 
              Service after changes constitutes acceptance of the new terms.
            </p>

            <h4 className="font-bold text-white mt-4">7. Contact</h4>
            <p>
              For questions about these terms, please contact the repository owner at 
              the GitHub project page.
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4 text-sm text-[#888] leading-relaxed">
            <h3 className="text-lg font-bold text-white">Privacy Policy</h3>
            <p className="text-[#666]">Last updated: {new Date().toLocaleDateString()}</p>

            <h4 className="font-bold text-white mt-4">1. Information We Process</h4>
            <p>
              ClipForge AI processes content locally in your browser. Video files, images, 
              and generated content are not uploaded to our servers. AI processing is done 
              through the Google Gemini API using your personal API key.
            </p>

            <h4 className="font-bold text-white mt-4">2. Data Storage</h4>
            <p>
              Your API key is stored locally in your browser's localStorage. Generated 
              images and video data are stored in your browser's memory and localStorage 
              for the purpose of app functionality. No data is sent to our servers.
            </p>

            <h4 className="font-bold text-white mt-4">3. Third-Party Services</h4>
            <p>
              When you use AI features, content is processed through the Google Gemini API 
              using your own API key. Please refer to Google's Privacy Policy for 
              information on how they handle data.
            </p>

            <h4 className="font-bold text-white mt-4">4. Cookies</h4>
            <p>
              The Service uses localStorage for local data persistence. No tracking cookies 
              or analytics are used.
            </p>

            <h4 className="font-bold text-white mt-4">5. Data Retention</h4>
            <p>
              Your content remains in your browser's local storage until you clear it. 
              You can delete all stored data at any time by clearing browser data for 
              this site.
            </p>

            <h4 className="font-bold text-white mt-4">6. Your Rights</h4>
            <p>
              You have the right to access, modify, or delete any data stored locally by 
              the Service. Since we do not maintain servers that store your data, no 
              additional deletion requests are necessary.
            </p>
          </div>
        );

      case 'dmca':
        return (
          <div className="space-y-4 text-sm text-[#888] leading-relaxed">
            <h3 className="text-lg font-bold text-white">DMCA Copyright Policy</h3>
            <p className="text-[#666]">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <p className="text-sm">
                ClipForge AI respects the intellectual property rights of others and expects 
                its users to do the same. We will respond to clear notices of alleged copyright 
                infringement.
              </p>
            </div>

            <h4 className="font-bold text-white mt-4">Reporting Infringement</h4>
            <p>
              If you believe that content processed through ClipForge AI infringes your 
              copyright, please submit a DMCA notice to the repository owner via the 
              GitHub project page with the following information:
            </p>
            <ul className="space-y-2 pl-4 list-decimal">
              <li>A physical or electronic signature of the copyright owner or authorized agent</li>
              <li>Identification of the copyrighted work claimed to be infringed</li>
              <li>Identification of the infringing material and information reasonably sufficient to locate it</li>
              <li>Your contact information (address, phone number, email)</li>
              <li>A statement that you have a good faith belief that the use is not authorized</li>
              <li>A statement, under penalty of perjury, that the information is accurate and you are authorized to act</li>
            </ul>

            <h4 className="font-bold text-white mt-4">Counter-Notification</h4>
            <p>
              If you believe your content was removed or disabled by mistake, you may submit 
              a counter-notification with the same contact information and a statement of 
              your good faith belief that the content was removed by mistake.
            </p>

            <h4 className="font-bold text-white mt-4">Repeat Infringers</h4>
            <p>
              We reserve the right to terminate access for users who are repeat infringers 
              of copyright or other intellectual property rights.
            </p>

            <div className="mt-4 p-3 bg-[#111]/50 rounded-lg border border-[#1a1a1a]">
              <p className="text-xs text-[#888]">
                Note: ClipForge AI is an open-source tool that processes content locally. 
                DMCA notices should be directed to the repository maintainer on GitHub.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#111] border border-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] mx-4 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900/30 p-2 rounded-full">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Legal & Policies</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[#1a1a1a] px-2 gap-1 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-[#888] hover:text-white hover:border-[#333]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {renderContent()}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[#1a1a1a] bg-[#111]/50 shrink-0">
          <p className="text-xs text-[#666]">
            Policies generated for ClipForge AI — {new Date().getFullYear()}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[#1a1a1a] hover:bg-[#222] text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptableUsePolicy;
