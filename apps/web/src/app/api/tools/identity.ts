import { z } from 'zod';
import { supabase } from '../lib/supabase';

export const whoAmISchema = z.object({});

export async function whoAmI() {
    // In a real app, this would come from auth context
    return {
        username: "User",
        role: "admin",
    };
}

export const getProjectsSchema = z.object({});

export async function getProjects() {
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        // If table doesn't exist or other error, return empty list or mock
        console.error("Error fetching projects:", error);
        return [];
    }

    return projects;
}
