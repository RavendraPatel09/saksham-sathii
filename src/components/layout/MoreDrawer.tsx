import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Compass, BookOpen, Briefcase, Trophy, Calendar as CalendarIcon, 
  Users, MessageCircle, HeartHandshake, Settings, HelpCircle, MessageSquare, KanbanSquare, Building, Landmark, FileText, Sparkles, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { OverlayWrapper } from '@/context/OverlayContext';

type MoreDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenAccessibility?: () => void;
  onOpenLanguage?: () => void;
};

export const MoreDrawer: React.FC<MoreDrawerProps> = ({ isOpen, onClose, onOpenAccessibility, onOpenLanguage }) => {
  const { t } = useLanguage();

  const groups = [
    {
      title: t('more.career_tools'),
      items: [
        { name: t('more.menu.assessment'), path: "/assessment", icon: Compass },
        { name: t('more.menu.interview'), path: "/interview", icon: Users },
        { name: t('more.menu.resume'), path: "/resume-builder", icon: Briefcase },
        { name: t('more.menu.roadmap'), path: "/career-roadmap", icon: Compass },
        { name: t('more.menu.tracker'), path: "/application-tracker", icon: KanbanSquare },
        { name: t('more.menu.employers'), path: "/employers-directory", icon: Building },
        { name: t('more.menu.resume_bank'), path: "/resume-bank", icon: FileText },
        { name: t('more.menu.accommodation_letter'), path: "/accommodation-letter", icon: FileText },
        { name: t('more.menu.interview_brief'), path: "/interview-brief", icon: FileText },
      ]
    },
    {
      title: t('more.accessibility'),
      items: [
        { name: t('more.menu.access_settings'), path: "#accessibility", icon: Settings },
        { name: t('more.menu.language'), path: "#language", icon: Settings },
        { name: t('more.menu.communication'), path: "/communication", icon: MessageCircle },
      ]
    },
    {
      title: t('more.community'),
      items: [
        { name: t('more.menu.community'), path: "/community", icon: Users },
        { name: t('more.menu.events'), path: "/events", icon: CalendarIcon },
        { name: t('more.menu.mentors'), path: "/mentors", icon: Users },
      ]
    },
    {
      title: t('more.daily_support'),
      items: [
        { name: t('more.menu.offline'), path: "/offline", icon: HeartHandshake },
        { name: t('more.menu.financial'), path: "/financial", icon: Trophy },
        { name: t('more.menu.safety'), path: "/safety", icon: HeartHandshake },
        { name: t('more.menu.simplify_document'), path: "/simplify-document", icon: Sparkles },
        { name: t('more.menu.share_progress'), path: "/share-progress", icon: Share2 },
      ]
    },
    {
      title: t('more.help'),
      items: [
        { name: t('more.menu.gov_support'), path: "/government-support", icon: HeartHandshake },
        { name: t('more.menu.reserved_jobs'), path: "/reserved-jobs", icon: Landmark },
        { name: t('more.menu.feedback'), path: "/post-employment", icon: MessageSquare },
        { name: t('more.menu.help_center'), path: "/", icon: HelpCircle },
      ]
    }
  ];

  return (
    <OverlayWrapper isOpen={isOpen} onClose={onClose} position="right" title="Explore More">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24 md:pb-4">
              {groups.map((group, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-2">
                    {group.title}
                  </h3>
                  <div className="grid gap-1">
                    {group.items.map((item, j) => (
                      <Link 
                        key={j} 
                        to={item.path !== '#accessibility' && item.path !== '#language' ? item.path : '#'}
                        onClick={(e) => {
                          if (item.path === '#accessibility') {
                            e.preventDefault();
                            onOpenAccessibility?.();
                          } else if (item.path === '#language') {
                            e.preventDefault();
                            onOpenLanguage?.();
                          } else {
                            onClose();
                          }
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors font-medium group"
                      >
                        <div className="bg-primary/5 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
    </OverlayWrapper>
  );
};
