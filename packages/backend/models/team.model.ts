import type { TeamMember } from "@aurix/types";

export interface TeamMemberRecord {
  id: string;
  user_id: string | null;
  full_name: string;
  designation: string;
  department_id: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_visible: boolean;
  joined_year: number | null;
  created_at: string;
  updated_at: string;
}

class MockTeamStore {
  private members: Map<string, TeamMemberRecord> = new Map();
  private isInitialized = false;

  async ensureInitialized() {
    if (this.isInitialized) return;
    const now = new Date().toISOString();
    const seed: TeamMemberRecord[] = [
      {
        id: "team_founder_01",
        user_id: null,
        full_name: "Advaith Kolkar",
        designation: "Founder & Lead Architect",
        department_id: "dept_tech_01",
        avatar_url: "/team/team-4.png",
        bio: "Visionary founder of AURIX club. Passionate about computer systems, distributed tech, and empowering student engineers to build high-impact platforms.",
        github_url: "https://github.com/advaithkolkar",
        linkedin_url: "https://linkedin.com/in/advaithkolkar",
        display_order: 1,
        is_visible: true,
        joined_year: 2023,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_cofounder_02",
        user_id: null,
        full_name: "Anish Sharma",
        designation: "Co-Founder & Head of Operations",
        department_id: "dept_sponsors_02",
        avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
        bio: "Co-founder orchestrating club strategy, institutional partnerships, and ecosystem scale. Focused on creating unforgettable experiences and growth opportunities.",
        github_url: "https://github.com/anishsharma",
        linkedin_url: "https://linkedin.com/in/anishsharma",
        display_order: 2,
        is_visible: true,
        joined_year: 2023,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_001",
        user_id: "admin_001",
        full_name: "Harshith Gowda",
        designation: "Club President & Technical Lead",
        department_id: "dept_tech_01",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
        bio: "Lead developer and president passionate about building products that matter. Directing club initiatives, technical workshops, and platform infrastructure.",
        github_url: "https://github.com/harshithgowda",
        linkedin_url: "https://linkedin.com/in/harshithgowda",
        display_order: 3,
        is_visible: true,
        joined_year: 2023,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_002",
        user_id: null,
        full_name: "Ananya Krishnan",
        designation: "Technical Lead",
        department_id: "dept_tech_01",
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
        bio: "Full-stack developer specializing in React and Node.js. Leads the technical initiatives and mentors junior members.",
        github_url: "https://github.com/ananyak",
        linkedin_url: "https://linkedin.com/in/ananyak",
        display_order: 2,
        is_visible: true,
        joined_year: 2023,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_003",
        user_id: null,
        full_name: "Preetham Shetty",
        designation: "Research Lead",
        department_id: "dept_research_03",
        avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60",
        bio: "ML enthusiast working on NLP and computer vision projects. Published researcher with papers in IEEE conferences.",
        github_url: "https://github.com/preeths",
        linkedin_url: "https://linkedin.com/in/preeths",
        display_order: 3,
        is_visible: true,
        joined_year: 2024,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_004",
        user_id: null,
        full_name: "Divya Menon",
        designation: "Marketing & Social Media Lead",
        department_id: "dept_media_04",
        avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
        bio: "Creative strategist managing AURIX's brand voice and online presence. Grew the club's social following by 300% in one year.",
        github_url: null,
        linkedin_url: "https://linkedin.com/in/divyamenon",
        display_order: 4,
        is_visible: true,
        joined_year: 2024,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_005",
        user_id: null,
        full_name: "Rohan Verma",
        designation: "Entrepreneur-in-Residence",
        department_id: "dept_startup_05",
        avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
        bio: "Serial entrepreneur mentoring student startups. Founded 2 successful companies and helps students navigate the startup ecosystem.",
        github_url: null,
        linkedin_url: "https://linkedin.com/in/rohanv",
        display_order: 5,
        is_visible: false, // hidden until officially announced
        joined_year: 2025,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_006",
        user_id: null,
        full_name: "Adithya P",
        designation: "EM Department Head",
        department_id: "dept_event_04",
        avatar_url: "/team/team-1.jpg",
        bio: "Department Head of Event Management. Leading event planning, hackathons, workshops, and campus experiences.",
        github_url: null,
        linkedin_url: null,
        display_order: 4,
        is_visible: true,
        joined_year: 2024,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_007",
        user_id: null,
        full_name: "Sony",
        designation: "IRS Co-Lead",
        department_id: "dept_sponsors_02",
        avatar_url: "/team/team-3.jpg",
        bio: "IRS Co-Lead, 3rd Year, IEM Branch. Managing corporate sponsorships, alumni relations, and industry partnerships.",
        github_url: null,
        linkedin_url: null,
        display_order: 5,
        is_visible: true,
        joined_year: 2024,
        created_at: now,
        updated_at: now,
      },
      {
        id: "team_008",
        user_id: null,
        full_name: "Rajveer Singh",
        designation: "IRS Co-Lead",
        department_id: "dept_sponsors_02",
        avatar_url: "/team/team-2.jpg",
        bio: "IRS Co-Lead. Spearheading corporate sponsorships, industry partnerships, and campus outreach.",
        github_url: null,
        linkedin_url: null,
        display_order: 6,
        is_visible: true,
        joined_year: 2024,
        created_at: now,
        updated_at: now,
      },
    ];
    this.members.clear();
    for (const m of seed) this.members.set(m.id, m);
    this.isInitialized = true;
  }

  async list(filters?: { forAdmin?: boolean; department_id?: string }): Promise<TeamMemberRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.members.values());
    if (!filters?.forAdmin) records = records.filter(m => m.is_visible);
    if (filters?.department_id) records = records.filter(m => m.department_id === filters.department_id);
    return records.sort((a, b) => a.display_order - b.display_order).map(m => ({ ...m }));
  }

  async findById(id: string): Promise<TeamMemberRecord | null> {
    await this.ensureInitialized();
    const m = this.members.get(id);
    return m ? { ...m } : null;
  }

  async create(data: Omit<TeamMemberRecord, "id" | "display_order" | "is_visible" | "created_at" | "updated_at"> & { display_order?: number }): Promise<TeamMemberRecord> {
    await this.ensureInitialized();
    const id = `team_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    // Auto-assign display order if not specified
    const maxOrder = Math.max(0, ...Array.from(this.members.values()).map(m => m.display_order));
    const record: TeamMemberRecord = { ...data, id, display_order: data.display_order ?? maxOrder + 1, is_visible: true, created_at: now, updated_at: now };
    this.members.set(id, record);
    return { ...record };
  }

  async update(id: string, partial: Partial<Omit<TeamMemberRecord, "id" | "created_at">>): Promise<TeamMemberRecord | null> {
    await this.ensureInitialized();
    const existing = this.members.get(id);
    if (!existing) return null;
    const updated: TeamMemberRecord = { ...existing, ...partial, updated_at: new Date().toISOString() };
    this.members.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.members.delete(id);
  }

  toDTO(record: TeamMemberRecord): TeamMember {
    return { ...record };
  }
}

const g = globalThis as unknown as { mockTeamStore?: MockTeamStore };
export const teamStore = g.mockTeamStore ?? new MockTeamStore();
if (process.env.NODE_ENV !== "production") g.mockTeamStore = teamStore;
export const teamModel = teamStore;
