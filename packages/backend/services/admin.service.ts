import { profileModel } from "../models/profile.model";
import { departmentModel } from "../models/department.model";
import { eventModel } from "../models/event.model";
import { programModel } from "../models/program.model";
import { postModel } from "../models/post.model";
import { applicationModel } from "../models/application.model";
import { mediaModel } from "../models/media.model";
import { emailModel } from "../models/email.model";

export interface AdminOverviewData {
  counts: {
    members: number;
    active_members: number;
    departments: number;
    events: number;
    published_events: number;
    programs: number;
    published_programs: number;
    posts: number;
    published_posts: number;
    pending_applications: number;
    total_applications: number;
    media_items: number;
    email_campaigns: number;
  };
  recent_applications: ReturnType<typeof applicationModel.toDTO>[];
  upcoming_events: ReturnType<typeof eventModel.eventToDTO>[];
  recent_posts: ReturnType<typeof postModel.toDTO>[];
}

class AdminService {
  async getOverview(): Promise<AdminOverviewData> {
    const [
      allUsers,
      allDepts,
      allEvents,
      allPrograms,
      allPosts,
      allApps,
      allMedia,
      allEmails,
    ] = await Promise.all([
      profileModel.list(),
      departmentModel.list(),
      eventModel.listEvents({ forAdmin: true }),
      programModel.list({ forAdmin: true }),
      postModel.list({ forAdmin: true }),
      applicationModel.list(),
      mediaModel.list(),
      emailModel.list(),
    ]);

    const activeMembers = allUsers.filter(u => u.is_active);
    const publishedEvents = allEvents.filter(e => e.status === "published");
    const publishedPrograms = allPrograms.filter(p => p.status === "published");
    const publishedPosts = allPosts.filter(p => p.status === "published");
    const pendingApps = allApps.filter(a => a.status === "pending");

    return {
      counts: {
        members: allUsers.length,
        active_members: activeMembers.length,
        departments: allDepts.length,
        events: allEvents.length,
        published_events: publishedEvents.length,
        programs: allPrograms.length,
        published_programs: publishedPrograms.length,
        posts: allPosts.length,
        published_posts: publishedPosts.length,
        pending_applications: pendingApps.length,
        total_applications: allApps.length,
        media_items: allMedia.length,
        email_campaigns: allEmails.length,
      },
      recent_applications: allApps.slice(0, 5).map(a => applicationModel.toDTO(a)),
      upcoming_events: publishedEvents.slice(0, 3).map(e => eventModel.eventToDTO(e)),
      recent_posts: allPosts.slice(0, 3).map(p => postModel.toDTO(p)),
    };
  }
}

export const adminService = new AdminService();
