-- Insert service categories
INSERT INTO public.service_categories (name, description, icon) VALUES
('Academic Writing', 'Essays, research papers, thesis writing, and academic editing', 'BookOpen'),
('Graphic Design', 'Logo design, flyers, posters, and digital graphics', 'Palette'),
('Web Development', 'Website creation, web apps, and digital solutions', 'Code'),
('Photography', 'Event photography, portraits, and photo editing', 'Camera'),
('Tutoring', 'Academic tutoring and exam preparation', 'GraduationCap'),
('Content Creation', 'Social media content, copywriting, and digital marketing', 'PenTool'),
('Video Editing', 'Video production, editing, and motion graphics', 'Video'),
('Translation', 'Language translation and interpretation services', 'Languages'),
('Music & Audio', 'Music production, audio editing, and sound design', 'Music'),
('Fashion & Beauty', 'Fashion design, styling, and beauty services', 'Shirt'),
('Event Planning', 'Event organization, decoration, and coordination', 'Calendar'),
('Tech Support', 'Computer repair, software installation, and IT support', 'Settings'),
('Crafts & Handmade', 'Handmade items, crafts, and custom creations', 'Scissors'),
('Fitness & Health', 'Personal training, nutrition advice, and wellness coaching', 'Heart'),
('Business Services', 'Business planning, consulting, and administrative support', 'Briefcase');

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, matric_number, faculty)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'matric_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'faculty', 'Arts')::faculty_type
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET 
    total_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.reviews 
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER update_rating_on_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();
