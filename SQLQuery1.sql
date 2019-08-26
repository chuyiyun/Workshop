
--Q1--
SELECT KEEPER_ID AS KeeperId,USER_CNAME AS CName,USER_ENAME AS EName,
		YEAR(LEND_DATE) AS BorrowYear,COUNT(LEND_DATE)AS BorrowCnt
FROM BOOK_LEND_RECORD,MEMBER_M
WHERE KEEPER_ID=user_id
GROUP BY KEEPER_ID,USER_CNAME,USER_ENAME ,YEAR(LEND_DATE)
ORDER BY KEEPER_ID;

--Q2--
SELECT TOP(5) B.BOOK_ID AS BookId,BOOK_NAME AS BookName,COUNT(KEEPER_ID) AS QTY
FROM BOOK_LEND_RECORD AS B,BOOK_DATA AS BD
WHERE B.BOOK_ID=BD.BOOK_ID
GROUP BY B.BOOK_ID,BOOK_NAME
ORDER BY QTY DESC;

--Q3--
SELECT  CASE DATENAME(QUARTER,LEND_DATE) 
			WHEN '1' THEN '2019/01~2019/03'
			WHEN '2' THEN '2019/04~2019/06'
			WHEN '3' THEN '2019/07~2019/09'
			ELSE '2019/10~2019/12'
			END 
			AS [Quarter]
			,COUNT(LEND_DATE)AS Cnt 
FROM BOOK_LEND_RECORD
WHERE YEAR(LEND_DATE)=2019
GROUP BY DATENAME(QUARTER,LEND_DATE)


--Q4--
SELECT  *
FROM(
	SELECT  ROW_NUMBER() OVER (PARTITION BY BC.BOOK_CLASS_NAME 
								ORDER BY COUNT(B.LEND_DATE) DESC,BC.BOOK_CLASS_NAME ASC,B.BOOK_ID ASC) AS Seq, 
								BOOK_CLASS_NAME AS BookClass ,
								B.BOOK_ID AS BookId ,
								BOOK_NAME AS BookName ,
								COUNT(B.LEND_DATE) AS Cnt
	FROM BOOK_CLASS AS BC , BOOK_DATA AS BD , BOOK_LEND_RECORD AS B
	WHERE  BC.BOOK_CLASS_ID= BD.BOOK_CLASS_ID AND  B.BOOK_ID=BD.BOOK_ID 
	GROUP BY BOOK_CLASS_NAME ,B.BOOK_ID ,BOOK_NAME
	--ORDER BY BookClass ASC,Cnt DESC ,BookId ASC
	)AS A
WHERE A.Seq <=3

--Q5--
WITH book(ClassId,ClassName,YR)
AS(
SELECT BC.BOOK_CLASS_ID,BC.BOOK_CLASS_NAME,YEAR(LEND_DATE) AS YR 
FROM BOOK_CLASS AS BC,BOOK_LEND_RECORD AS B,BOOK_DATA AS BD
WHERE BC.BOOK_CLASS_ID= BD.BOOK_CLASS_ID AND  B.BOOK_ID=BD.BOOK_ID 
)

SELECT ClassId,ClassName,
COUNT(CASE YR WHEN '2016' THEN YR END)AS 'CNT2016',
COUNT(CASE YR WHEN '2017' THEN YR  END)AS 'CNT2017',
COUNT(CASE YR WHEN '2018' THEN YR END)AS 'CNT2018',
COUNT(CASE YR WHEN '2019' THEN YR  END)AS 'CNT2019'
FROM book
GROUP BY ClassId,ClassName
ORDER BY ClassId ASC

--Q6--
SELECT P.ClassId,P.ClassName,P.[2016] AS CNT2016,P.[2017] AS CNT2017,P.[2018] AS CNT2018,P.[2019] AS CNT2019
FROM (
	SELECT BC.BOOK_CLASS_ID AS ClassId,BC.BOOK_CLASS_NAME AS ClassName,YEAR(LEND_DATE) AS YR 
	FROM BOOK_CLASS AS BC,BOOK_LEND_RECORD AS B,BOOK_DATA AS BD
	WHERE BC.BOOK_CLASS_ID= BD.BOOK_CLASS_ID AND  B.BOOK_ID=BD.BOOK_ID 
)AS T
PIVOT (
	COUNT(YR) FOR YR IN ([2016],[2017],[2018],[2019])
)AS P
ORDER BY P.ClassId ASC

--Q7--
SELECT BD.BOOK_ID AS '書本ID',BD.BOOK_BOUGHT_DATE AS '購書日期',LEND_DATE AS '借閱日期',BC.BOOK_CLASS_ID+'-'+BC.BOOK_CLASS_NAME AS '書籍類別',
		KEEPER_ID+'-'+USER_CNAME+'('+USER_ENAME+')' AS '借閱人',BD.BOOK_STATUS+'-'+BOOK_CODE.CODE_NAME AS '狀態',BD.BOOK_AMOUNT AS '購書金額'
FROM BOOK_DATA AS BD,BOOK_LEND_RECORD AS B,BOOK_CLASS AS BC,MEMBER_M AS M,BOOK_CODE 
WHERE BC.BOOK_CLASS_ID= BD.BOOK_CLASS_ID AND  B.BOOK_ID=BD.BOOK_ID AND M.USER_ID=B.KEEPER_ID AND BOOK_CODE.CODE_ID=BD.BOOK_STATUS AND BD.BOOK_KEEPER=M.USER_ID
      AND B.KEEPER_ID=0002
	 --AND B.BOOK_ID=2152
ORDER BY BD.BOOK_AMOUNT DESC


