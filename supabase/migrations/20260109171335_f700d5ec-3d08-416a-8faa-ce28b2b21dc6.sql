-- Update handle_new_user function to include new questionnaire fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, country, field_of_work, opportunity_interests)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'country', 'Unknown'),
    NEW.raw_user_meta_data ->> 'field_of_work',
    COALESCE(
      (SELECT array_agg(value::text) FROM jsonb_array_elements_text(NEW.raw_user_meta_data -> 'opportunity_interests')),
      '{}'::text[]
    )
  );
  RETURN NEW;
END;
$function$;