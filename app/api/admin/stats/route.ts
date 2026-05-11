// app/api/admin/stats/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg

import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { demoRegistrations } from '../../../../lib/demo-store';

export async function GET() {
  try {
    const [totalResult, careerResult, schoolResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM registrations'),
      query(`
        SELECT c.name, COUNT(r.id) as count 
        FROM careers c 
        LEFT JOIN registrations r ON c.id = r.career_id 
        GROUP BY c.id, c.name 
        ORDER BY count DESC
      `),
      query(`
        SELECT s.name, COUNT(r.id) as count 
        FROM schools s 
        LEFT JOIN registrations r ON s.id = r.school_id 
        GROUP BY s.id, s.name 
        ORDER BY count DESC
      `),
    ]);

    return NextResponse.json({
      total_registrations: parseInt(totalResult.rows[0].count),
      by_career: careerResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
      by_school: schoolResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
    });
  } catch (error) {
    console.error('[Stats Error - Calculating from Demo Store]:', error);
    
    // Calculate real-time stats from the demo memory store
    const total = demoRegistrations.length;
    
    const byCareer = demoRegistrations.reduce((acc: any, curr) => {
      const existing = acc.find((a: any) => a.name === curr.career_name);
      if (existing) existing.count++;
      else acc.push({ name: curr.career_name, count: 1 });
      return acc;
    }, []).sort((a: any, b: any) => b.count - a.count);

    const bySchool = demoRegistrations.reduce((acc: any, curr) => {
      const existing = acc.find((a: any) => a.name === curr.school_name);
      if (existing) existing.count++;
      else acc.push({ name: curr.school_name, count: 1 });
      return acc;
    }, []).sort((a: any, b: any) => b.count - a.count);

    return NextResponse.json({
      total_registrations: total,
      by_career: byCareer,
      by_school: bySchool
    });
  }
}
