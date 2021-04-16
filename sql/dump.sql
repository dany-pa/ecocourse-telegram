PGDMP     $                    y         	   ecocourse    13.1    13.1 )    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16459 	   ecocourse    DATABASE     f   CREATE DATABASE ecocourse WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Russian_Russia.1251';
    DROP DATABASE ecocourse;
                postgres    false            �            1255    39331    get_user_last_answer(integer)    FUNCTION     �  CREATE FUNCTION public.get_user_last_answer(userid integer) RETURNS TABLE(id integer, user_id integer, question_id integer, is_correct_answer boolean, answer_dt timestamp with time zone, course_id integer)
    LANGUAGE plpgsql
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
$$;
 ;   DROP FUNCTION public.get_user_last_answer(userid integer);
       public          postgres    false            �            1259    16510    answers    TABLE     �   CREATE TABLE public.answers (
    id integer NOT NULL,
    answer text NOT NULL,
    answer_id integer NOT NULL,
    question_id integer NOT NULL
);
    DROP TABLE public.answers;
       public         heap    postgres    false            �           0    0    TABLE answers    ACL     -   GRANT SELECT ON TABLE public.answers TO web;
          public          postgres    false    207            �            1259    16485    users_answers    TABLE       CREATE TABLE public.users_answers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    question_id integer NOT NULL,
    is_correct_answer boolean NOT NULL,
    answer_dt timestamp with time zone DEFAULT now() NOT NULL,
    course_id integer DEFAULT 0 NOT NULL
);
 !   DROP TABLE public.users_answers;
       public         heap    postgres    false            �           0    0    TABLE users_answers    ACL     :   GRANT SELECT,INSERT ON TABLE public.users_answers TO web;
          public          postgres    false    202            �            1259    16490    answers_id_seq    SEQUENCE     �   ALTER TABLE public.users_answers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    202            �            1259    16518    answers_id_seq1    SEQUENCE     �   ALTER TABLE public.answers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.answers_id_seq1
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    207            �            1259    16494    courses    TABLE     R   CREATE TABLE public.courses (
    id integer NOT NULL,
    title text NOT NULL
);
    DROP TABLE public.courses;
       public         heap    postgres    false            �           0    0    TABLE courses    ACL     -   GRANT INSERT ON TABLE public.courses TO web;
          public          postgres    false    204            �            1259    16502    courses_id_seq    SEQUENCE     �   ALTER TABLE public.courses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.courses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    204            �            1259    16549    messages_log    TABLE     �   CREATE TABLE public.messages_log (
    id integer NOT NULL,
    "from" integer NOT NULL,
    "to" integer NOT NULL,
    text text,
    message_dt timestamp with time zone DEFAULT now() NOT NULL
);
     DROP TABLE public.messages_log;
       public         heap    postgres    false            �           0    0    TABLE messages_log    ACL     2   GRANT INSERT ON TABLE public.messages_log TO web;
          public          postgres    false    210            �            1259    16547    mesagesLog_id_seq    SEQUENCE     �   ALTER TABLE public.messages_log ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."mesagesLog_id_seq"
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    210            �            1259    16468 	   questions    TABLE     �   CREATE TABLE public.questions (
    id integer NOT NULL,
    question text,
    correct_answer integer,
    course_id integer
);
    DROP TABLE public.questions;
       public         heap    postgres    false            �           0    0    TABLE questions    ACL     /   GRANT SELECT ON TABLE public.questions TO web;
          public          postgres    false    201            �            1259    16504    questions_id_seq    SEQUENCE     �   ALTER TABLE public.questions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.questions_id_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    201            �            1259    16460    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    cur_question integer DEFAULT 0 NOT NULL,
    registration_dt timestamp with time zone DEFAULT now(),
    user_id integer,
    chat_id integer,
    can_get_new_question boolean DEFAULT true NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �           0    0    TABLE users    ACL     2   GRANT SELECT,INSERT ON TABLE public.users TO web;
          public          postgres    false    200            �            1259    39356    users_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    200            �          0    16510    answers 
   TABLE DATA           E   COPY public.answers (id, answer, answer_id, question_id) FROM stdin;
    public          postgres    false    207   �+       �          0    16494    courses 
   TABLE DATA           ,   COPY public.courses (id, title) FROM stdin;
    public          postgres    false    204   4,       �          0    16549    messages_log 
   TABLE DATA           J   COPY public.messages_log (id, "from", "to", text, message_dt) FROM stdin;
    public          postgres    false    210   },       �          0    16468 	   questions 
   TABLE DATA           L   COPY public.questions (id, question, correct_answer, course_id) FROM stdin;
    public          postgres    false    201   �3       �          0    16460    users 
   TABLE DATA           p   COPY public.users (id, name, cur_question, registration_dt, user_id, chat_id, can_get_new_question) FROM stdin;
    public          postgres    false    200   �3       �          0    16485    users_answers 
   TABLE DATA           j   COPY public.users_answers (id, user_id, question_id, is_correct_answer, answer_dt, course_id) FROM stdin;
    public          postgres    false    202   L4       �           0    0    answers_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.answers_id_seq', 124, true);
          public          postgres    false    203            �           0    0    answers_id_seq1    SEQUENCE SET     >   SELECT pg_catalog.setval('public.answers_id_seq1', 10, true);
          public          postgres    false    208            �           0    0    courses_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.courses_id_seq', 1, true);
          public          postgres    false    205            �           0    0    mesagesLog_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."mesagesLog_id_seq"', 372, true);
          public          postgres    false    209            �           0    0    questions_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.questions_id_seq', 3, true);
          public          postgres    false    206            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public          postgres    false    211            Q           2606    16489    users_answers answers_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.users_answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.users_answers DROP CONSTRAINT answers_pkey;
       public            postgres    false    202            U           2606    16517    answers answers_pkey1 
   CONSTRAINT     S   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey1 PRIMARY KEY (id);
 ?   ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey1;
       public            postgres    false    207            S           2606    16501    courses courses_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
       public            postgres    false    204            W           2606    16556    messages_log mesagesLog_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.messages_log
    ADD CONSTRAINT "mesagesLog_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.messages_log DROP CONSTRAINT "mesagesLog_pkey";
       public            postgres    false    210            O           2606    16472    questions questions_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    201            M           2606    16467    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    200            �   E   x�3�4�3�4�4�2�4��,s ː�Ȳ�4 �Y���\� Th�eh�ya����b���� ���      �   9   x�. ��1	Касается ли это меня?
\.


�("      �   �  x��[�N#G>�S�ޙ��K� \��C�h#�{�C�݈����"A�\r�,^,�z^!O���n�L�OlgQXy쮮��~�]f,Z�q(�Xמ�|��Ϋ5��Y(�EI��H�~�u��������\��k9)��۠ʉ����=x�7�x�$����|�㛰B���p�F'��|�n���w_m���ow�w�V�.p{$7���y	��'y
2���`0[|�I٘�j�Oe��qe�)4IM٭����A�Q���cx:���J^���xF1xk��-�
�M4 f,Ǜ��X�7}��<�� ��F���B��}���"p�� ���)�'O�]@0����9��V� b� )G�|���kx��v����jgj[�L!/����A�|��@rP->V��3��J�7Z���=x�JU�&�N��:�ȆT��v���Ϡ�ʵo^�	�7�;�/�P��*�,f��6`��*[~R���}W�9z� !+�2�x��a+u�����|��8,�L����?>���7��W�f�|�崚�JG#��cTp�j��HG+u��]av���M=�
1'�������V�"��j�TO����;��H���	֣��R;�:�&YD�"���,�#�;�t0D��V�)QY�3h�L�h�C�!5$q8QL���4�5��4HF���aZ^�?߿��0�]��+��,:A�T�>�"�I?�|ipH�u0\����Í0����h��i�ֻ0�9�J)��G�oI�>���e��/7fsK� �ϱ�K�؈�������%�Tu�3rM7D�M9�� uR��7����l{@~�4��zy0�d/z<�}�Y��I�i<����m<-��wO�EH6O�Ώ�1^E��d�I�B�U�p�5�.���c�*{�g���HF%!�u�z������=j>*R�4HF������ᕞ����Jӓ�+=MO7�����S�(��\�K-�� �?����fw,�Wy�BG�Ȣ�w�bz\�<}?���拃O��v<��ν�*�ĥ��7}:�l�kޢ��̧rҒ!���W��"�ڑ�4D�^!d��
�����Qdenm]2�Z�|���t�@F�/#�-7���氘���Y=<W'�|ŁkĘ��&([��R<�p��8"�~7�F��̅�MWy2���u2�L�C���`9̾Rk/����A�p�V��s�&�)U���s��d)��K�x�-�X�*�C���~�8��f�F[�ݢ��r��X�#�h�a�yG�����J�Ê���y����rc^�dS����?������&������(�������
Ζ���g
�U-���;B�-��D�)g-m�}%�[r��1�mb�~��-��e8����g��&��q���x�����cM��QFd��Mi�ã�[:cNЧ฾��bs1����H|�t{*��0��G�3}���������T�ۦxݒ��(4gP��-��Դ?�@�?��;���cw��Cڣ���ez&�w�uy�ZM����"ӧ7�-�U�rp�w��Jw��1ųdX�ݯ���w,��{�7ѣ��L{���%n�7�I�^�#��XX0*�)����d��5���7�4��<n%%Fwh�X���8����}�m��^���e�� ���_��MM����)2A�Н�y�rf9��_N̯H5�~����D1�r�>���f���UP� =��#���I\����<!�@�k��Rw"�}k����/,�ep      �   b   x���� �GW���V H��X�=MD�a�#����d[��q��H���ˌ�C����%�Df�J�Q��Kd\:}.=ud�%7N��֡1�|� 6�      �   H   x�3�t�HN�)��/J-�4�4202�50�54S0��22�20ճ01013�60�465012264Ab�p��qqq �~      �   ;   x���� �w2E���Tf���G�]ѡ	�*����^���pk@K�
���.	�     