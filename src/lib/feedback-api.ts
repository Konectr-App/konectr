// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { supabase } from './supabase';
import type { FeedbackTicket, FeedbackTicketDetail, VoteType } from '@/types/feedback';

/**
 * Get all public feedback tickets with pagination and filtering
 */
export async function getFeedbackTickets(params: {
  category?: string;
  status?: string;
  sortBy?: 'created_at' | 'upvotes' | 'trending';
  limit?: number;
  offset?: number;
}): Promise<FeedbackTicket[]> {
  const { data, error } = await supabase.rpc('get_public_feedback_tickets', {
    p_category: params.category || null,
    p_status: params.status || null,
    p_sort_by: params.sortBy || 'created_at',
    p_limit: params.limit || 20,
    p_offset: params.offset || 0,
  });

  if (error) {
    console.error('Error fetching feedback tickets:', error);
    throw error;
  }

  return (data as FeedbackTicket[]) || [];
}

/**
 * Get a single feedback ticket by ID with full details
 */
export async function getFeedbackTicket(ticketId: string): Promise<FeedbackTicketDetail | null> {
  const { data, error } = await supabase.rpc('get_feedback_ticket_by_id', {
    p_ticket_id: ticketId,
  });

  if (error) {
    console.error('Error fetching feedback ticket:', error);
    throw error;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  return Array.isArray(data) ? (data[0] as FeedbackTicketDetail) : (data as FeedbackTicketDetail);
}

/**
 * Get current user's vote on a ticket
 */
export async function getUserVote(ticketId: string, userId: string): Promise<VoteType> {
  const { data, error } = await supabase.rpc('get_user_feedback_vote', {
    p_ticket_id: ticketId,
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching user vote:', error);
    return null;
  }

  return data as VoteType;
}

/**
 * Cast or toggle a vote on a ticket
 * Returns 'created' | 'removed' | 'changed'
 */
export async function castVote(
  ticketId: string,
  voteType: 'upvote' | 'downvote'
): Promise<string> {
  const { data, error } = await supabase.rpc('cast_feedback_vote', {
    p_ticket_id: ticketId,
    p_vote_type: voteType,
  });

  if (error) {
    console.error('Error casting vote:', error);
    throw error;
  }

  return data as string;
}

/**
 * Get total ticket count (for pagination)
 */
export async function getTicketCount(params?: {
  category?: string;
  status?: string;
}): Promise<number> {
  let query = supabase
    .from('feedback_tickets')
    .select('*', { count: 'exact', head: true });

  if (params?.category) {
    query = query.eq('category', params.category);
  }

  if (params?.status) {
    query = query.eq('status', params.status);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error getting ticket count:', error);
    throw error;
  }

  return count || 0;
}
