import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';

/** A date `days` from now at `hour`:`minute` local time. Keeps demo data always "upcoming". */
function at(days: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/**
 * Fills an EMPTY database with demo users, clubs, events and activities,
 * so the app never looks empty during a demo. Disable with SEED_DEMO="false".
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger('Seed');

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_DEMO === 'false') return;
    if ((await this.prisma.user.count()) === 0) await this.seedBase();
    if ((await this.prisma.poll.count()) === 0) await this.seedPolls();
  }

  private async seedBase() {

    this.logger.log('Empty database — adding demo data...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const user = (email: string, name: string, faculty: string, year: number, role: 'STUDENT' | 'ADMIN' = 'STUDENT') =>
      this.prisma.user.create({ data: { email, name, faculty, year, role, passwordHash } });

    const admin = await user('admin@campushub.kz', 'Campus Admin', 'Student Affairs', 1, 'ADMIN');
    const aigerim = await user('aigerim@campushub.kz', 'Aigerim Sadykova', 'Information Systems', 3);
    const daniyar = await user('daniyar@campushub.kz', 'Daniyar Omarov', 'Business School', 2);
    const madina = await user('madina@campushub.kz', 'Madina Akhmetova', 'Computer Science', 1);
    const student = await user('student@campushub.kz', 'Demo Student', 'Information Systems', 3);

    const club = (name: string, category: 'IT' | 'BUSINESS' | 'SPORTS' | 'VOLUNTEER' | 'CREATIVE' | 'DEBATE', description: string) =>
      this.prisma.club.create({ data: { name, category, description } });

    const code = await club('Code Society', 'IT', 'We build side projects, prepare for hackathons and help each other learn to code. Beginners are very welcome.');
    const startup = await club('Startup Hub', 'BUSINESS', 'Meet founders, pitch your ideas and learn how student startups grow from an idea to a real product.');
    const runners = await club('Campus Runners', 'SPORTS', 'Easy morning runs around campus three times a week. All paces, no pressure.');
    const volunteers = await club('Volunteers United', 'VOLUNTEER', 'Weekend volunteering in the city: shelters, eco clean-ups and charity events.');
    const design = await club('Art & Design Collective', 'CREATIVE', 'Illustration, UI design and photography. Monthly workshops and an end-of-year exhibition.');
    const debate = await club('Debate Union', 'DEBATE', 'Weekly debate practice in English and Russian. Learn to argue clearly and speak with confidence.');

    // Club representatives (they can publish events for their clubs)
    await this.prisma.clubMember.createMany({
      data: [
        { userId: aigerim.id, clubId: code.id, role: 'REPRESENTATIVE', status: 'APPROVED' },
        { userId: daniyar.id, clubId: startup.id, role: 'REPRESENTATIVE', status: 'APPROVED' },
        { userId: daniyar.id, clubId: runners.id, role: 'REPRESENTATIVE', status: 'APPROVED' },
        { userId: student.id, clubId: design.id, role: 'REPRESENTATIVE', status: 'APPROVED' },
      ],
    });

    const event = (title: string, clubId: string | null, startsAt: Date, location: string, description: string, capacity: number | null, createdById: string) =>
      this.prisma.event.create({ data: { title, clubId, startsAt, location, description, capacity, createdById } });

    const hackathon = await event('Campus Hackathon 2026', code.id, at(5, 10), 'Main building, Hall A', '24 hours to build something useful for students. Teams of 2–4, mentors on site, food included.', 120, aigerim.id);
    await event('Startup Pitch Night', startup.id, at(2, 18, 30), 'Business School, Room 214', 'Five student teams pitch their ideas to local founders. Come to listen, ask questions and network.', 60, daniyar.id);
    const run = await event('Sunrise 5K Run', runners.id, at(1, 7), 'Campus main gate', 'An easy 5 km run around campus followed by coffee together.', null, daniyar.id);
    await event('City Clean-up Day', volunteers.id, at(6, 11), 'Meet at the library entrance', 'We clean up the park next to campus. Gloves and bags provided.', 40, admin.id);
    await event('UI Design Workshop', design.id, at(3, 16), 'Design Lab, 3rd floor', 'Hands-on intro to designing clean app screens in Figma. Bring a laptop.', 25, student.id);
    await event('Debate Open Tournament', debate.id, at(9, 14), 'Assembly Hall', 'Friendly tournament for all levels. Register as a team of two or alone — we will match you.', 48, admin.id);
    await event('Welcome Fest', null, at(12, 17), 'Central square', 'The big start-of-semester festival: clubs fair, music and food trucks.', null, admin.id);

    await this.prisma.eventRegistration.createMany({
      data: [
        { userId: student.id, eventId: hackathon.id },
        { userId: aigerim.id, eventId: hackathon.id },
        { userId: madina.id, eventId: run.id },
      ],
    });

    const activity = (title: string, category: 'FOOD' | 'STUDY' | 'SPORTS' | 'CULTURE' | 'GAMES' | 'OTHER', startsAt: Date, location: string, maxParticipants: number, description: string, creatorId: string, others: string[] = []) =>
      this.prisma.activity.create({
        data: {
          title, category, startsAt, location, maxParticipants, description, creatorId,
          participants: { create: [creatorId, ...others].map((userId) => ({ userId })) },
        },
      });

    await activity('Lunch at the canteen', 'FOOD', at(1, 13), 'Main canteen, 1st floor', 4, 'Looking for people to have lunch with between lectures. New students welcome!', madina.id);
    await activity('MIS exam study group', 'STUDY', at(2, 15), 'Library, room 3', 6, 'Let’s go through ERP, SCM and CRM topics together before the exam. Bring your notes.', aigerim.id, [student.id]);
    await activity('Cinema on Friday', 'CULTURE', at(4, 19, 30), 'Mega cinema', 5, 'Going to see the new sci-fi movie. We will choose the exact session together.', daniyar.id, [madina.id]);
    await activity('Board games evening', 'GAMES', at(3, 18), 'Student lounge', 8, 'Catan, Codenames and Uno. Bring your favourite game if you have one.', student.id, [aigerim.id, madina.id]);
    await activity('Evening walk', 'OTHER', at(2, 20), 'Campus park', 6, 'A relaxed walk around the park after classes.', madina.id);
    await activity('Football 5 vs 5', 'SPORTS', at(5, 17), 'Sports ground behind dorm 2', 10, 'Friendly game, all levels. We need a few more players!', daniyar.id, [aigerim.id]);

    await this.prisma.clubFollow.createMany({
      data: [
        { userId: student.id, clubId: code.id },
        { userId: student.id, clubId: design.id },
        { userId: aigerim.id, clubId: code.id },
        { userId: madina.id, clubId: runners.id },
        { userId: daniyar.id, clubId: startup.id },
      ],
    });

    this.logger.log('Demo data ready. Log in as student@campushub.kz / password123');
  }

  /** Demo polls — added separately so existing databases get them too. */
  private async seedPolls() {
    const users = await this.prisma.user.findMany({
      where: { email: { in: ['admin@campushub.kz', 'aigerim@campushub.kz', 'daniyar@campushub.kz', 'madina@campushub.kz', 'student@campushub.kz'] } },
    });
    const byEmail = (email: string) => users.find((u) => u.email === email);
    const admin = byEmail('admin@campushub.kz');
    if (!admin) return; // not the demo database

    const voters = users.filter((u) => u.id !== admin.id);
    const poll = async (question: string, options: string[], votes: number[], creatorId: string, endsInDays?: number) => {
      const created = await this.prisma.poll.create({
        data: {
          question,
          creatorId,
          endsAt: endsInDays ? at(endsInDays, 23, 59) : null,
          options: { create: options.map((text, position) => ({ text, position })) },
        },
        include: { options: { orderBy: { position: 'asc' } } },
      });
      // votes[i] = which option voter i picked (-1 = did not vote)
      await this.prisma.pollVote.createMany({
        data: votes
          .map((optionIndex, i) => ({ voter: voters[i], option: created.options[optionIndex] }))
          .filter((v) => v.voter && v.option)
          .map((v) => ({ userId: v.voter!.id, pollId: created.id, optionId: v.option!.id })),
      });
    };

    await poll('What should the theme of the Spring Festival be?', ['Retro 90s', 'Space & stars', 'K-pop night', 'Nomad culture'], [3, 1, 3, -1], admin.id, 10);
    await poll('Which new club would you join?', ['Chess club', 'Photography', 'Cooking club', 'Esports team'], [3, 2, 0, -1], admin.id);
    const student = byEmail('student@campushub.kz');
    if (student) {
      await poll('Best time for the next study group?', ['Weekday evenings', 'Saturday morning', 'Sunday afternoon'], [0, 0, 1, -1], student.id, 5);
    }
    this.logger.log('Demo polls added.');
  }
}
