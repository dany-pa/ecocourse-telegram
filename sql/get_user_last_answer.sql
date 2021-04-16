DROP FUNCTION "get_user_last_answer"(integer);
CREATE OR REPLACE FUNCTION get_user_last_answer(
    userid INTEGER
) 
RETURNS TABLE(
    id integer,
    user_id integer,
    question_id integer,
    is_correct_answer BOOLEAN,
    answer_dt timestamp with time zone,
    course_id integer
)
language plpgsql
AS $$
    BEGIN
	 RETURN QUERY
         SELECT 
            * 
        FROM 
            users_answers 
        WHERE 
            users_answers.user_id = userid 
        ORDER BY 
            answer_dt DESC 
        LIMIT 1
        ;
    
    END;
$$