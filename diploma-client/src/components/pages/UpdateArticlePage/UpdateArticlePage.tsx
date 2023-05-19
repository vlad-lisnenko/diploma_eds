import React, {FC} from 'react';
import {UpdateArticleForm} from "../../UpdateArticleForm/UpdateArticleForm";
import {useParams} from "react-router-dom";

type UpdateArticlePageParams = {
  id: any
}

export const UpdateArticlePage: FC = () => {
  const {id} = useParams<UpdateArticlePageParams>()

  return (
    <UpdateArticleForm id={id} />
  );
};