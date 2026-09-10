import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Submitting (or editing) a review on a trainer's public profile.
// Reviewer identity is supplied by the client the same way the rest of this
// app's forms work (no server-side session check here) — the UI only shows
// the "Write a Review" form to a signed-in visitor. Every review lands as
// unapproved regardless of who submits it; it only becomes publicly visible
// once an admin approves it from /admin/trainer-reviews.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { trainerId, reviewerId, reviewerName, rating, comment } = body;

        if (!trainerId || !reviewerId || !reviewerName) {
            return NextResponse.json(
                { error: 'trainerId, reviewerId and reviewerName are required' },
                { status: 400 }
            );
        }

        const numericRating = Number(rating);
        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return NextResponse.json(
                { error: 'rating must be a whole number between 1 and 5' },
                { status: 400 }
            );
        }

        if (trainerId === reviewerId) {
            return NextResponse.json(
                { error: 'You cannot review your own profile' },
                { status: 400 }
            );
        }

        const supabase = createSupabaseClientForServer();

        // Upsert so a trainer/reviewer pair only ever has one review row —
        // resubmitting (e.g. editing feedback) updates it and sends it back
        // through approval rather than piling up duplicates.
        const { error } = await supabase
            .from('trainer_reviews')
            .upsert(
                {
                    trainer_id: trainerId,
                    reviewer_id: reviewerId,
                    reviewer_name: reviewerName,
                    rating: numericRating,
                    comment: comment || null,
                    is_approved: false,
                    approved_at: null,
                },
                { onConflict: 'trainer_id,reviewer_id' }
            );

        if (error) throw error;

        return NextResponse.json(
            { message: 'Review submitted and pending approval' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error submitting trainer review:', error);
        return NextResponse.json(
            { error: 'Failed to submit review. Please try again later.' },
            { status: 500 }
        );
    }
}
