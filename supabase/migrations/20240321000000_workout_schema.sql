-- Create enum types for workout attributes
CREATE TYPE workout_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE workout_difficulty AS ENUM ('basic', 'intermediate', 'advanced');
CREATE TYPE workout_type AS ENUM (
  'facial_fitness',
  'cardio',
  'power_flow',
  'sculpt',
  'express',
  'recovery'
);

-- Create workouts table
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type workout_type NOT NULL,
  difficulty workout_difficulty NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status workout_status DEFAULT 'draft',
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  visibility TEXT DEFAULT 'public'
);

-- Create workout content blocks table for structured content
CREATE TABLE workout_content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'text', 'video', 'image', 'exercise'
  content JSONB NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout media table for additional images and videos
CREATE TABLE workout_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'image', 'video'
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  "order" INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout tags for better categorization
CREATE TABLE workout_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for workout tags
CREATE TABLE workout_to_tags (
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES workout_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (workout_id, tag_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_workouts_status ON workouts(status);
CREATE INDEX idx_workouts_type ON workouts(type);
CREATE INDEX idx_workouts_difficulty ON workouts(difficulty);
CREATE INDEX idx_workouts_scheduled_for ON workouts(scheduled_for);
CREATE INDEX idx_workout_content_blocks_workout_id ON workout_content_blocks(workout_id);
CREATE INDEX idx_workout_media_workout_id ON workout_media(workout_id);

-- Add RLS policies
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_to_tags ENABLE ROW LEVEL SECURITY;

-- Policies for workouts
CREATE POLICY "Public workouts are viewable by everyone" ON workouts
  FOR SELECT USING (
    visibility = 'public' 
    AND status = 'published'
    AND (scheduled_for IS NULL OR scheduled_for <= NOW())
  );

CREATE POLICY "Users can view their private workouts" ON workouts
  FOR SELECT USING (
    auth.uid() = created_by
  );

CREATE POLICY "Admins have full access to workouts" ON workouts
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for workout content blocks
CREATE POLICY "Content blocks viewable with workout" ON workout_content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_content_blocks.workout_id
      AND (
        workouts.visibility = 'public'
        OR workouts.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
      )
    )
  );

-- Policies for workout media
CREATE POLICY "Media viewable with workout" ON workout_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_media.workout_id
      AND (
        workouts.visibility = 'public'
        OR workouts.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
      )
    )
  );

-- Policies for tags
CREATE POLICY "Tags are viewable by everyone" ON workout_tags
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage tags" ON workout_tags
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_content_blocks_updated_at
  BEFORE UPDATE ON workout_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 