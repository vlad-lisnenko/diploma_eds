import React, {FC} from 'react';
import {Link} from 'react-router-dom';

type Props = {
  totalCount: number
  currentPage: number
  pageSize: number
  pageToLinkMapper: (pageNumber: number) => string
}

export const PaginationComponent: FC<Props> = props => {
  const totalPagesCount = props.totalCount % props.pageSize === 0 ? props.totalCount/props.pageSize : Math.floor(props.totalCount/props.pageSize) + 1
  const sideStep = 2
  const leftPages = []
  const rightPages = []

  for (let pageNumber = Math.max(props.currentPage - sideStep, 1); pageNumber < props.currentPage; pageNumber++) {
    leftPages.push(pageNumber)
  }

  for (let pageNumber = props.currentPage + 1; pageNumber <= Math.min(props.currentPage + sideStep, totalPagesCount); pageNumber++) {
    rightPages.push(pageNumber)
  }

  return (
    <div>
      <div className="common__flex" style={{alignItems: 'flex-end'}}>
        {props.currentPage - sideStep - 1 === 1 ? <PaginationLink link={props.pageToLinkMapper(1)} value={1}/> : null}
        {props.currentPage - sideStep - 1 > 1 ?
          <>
            <PaginationLink link={props.pageToLinkMapper(1)} value={1}/>
            <PaginationLink link="#" value="..."/>
            {leftPages.map(it => <PaginationLink link={props.pageToLinkMapper(it)} value={it}/>)}
          </>:
          leftPages.map(it => <PaginationLink link={props.pageToLinkMapper(it)} value={it}/>)}

          <div>
            <PaginationLink link={props.pageToLinkMapper(props.currentPage)}
                            fontSize="30pt"
                            value={props.currentPage}/>
          </div>

        {totalPagesCount - props.currentPage - 2 > 1 ?
          <>
            {rightPages.map(it => <PaginationLink link={props.pageToLinkMapper(it)} value={it}/>)}
            <PaginationLink link="#" value="..."/>
            <PaginationLink link={props.pageToLinkMapper(totalPagesCount)} value={totalPagesCount}/>
          </>:
          rightPages.map(it => <PaginationLink link={props.pageToLinkMapper(it)} value={it}/>)}
        {totalPagesCount - props.currentPage - 2 === 1 ?
          <PaginationLink link={props.pageToLinkMapper(totalPagesCount)} value={totalPagesCount}/> : null }
      </div>
    </div>
  );
};

type PaginationLinkProps = {
  value: number | string
  link: string
  fontSize?: string
}

const PaginationLink: FC<PaginationLinkProps> = props => {
  return (
    <div style={{padding: "0 1em"}}>
      <Link to={props.link}>
        <div style={{fontSize: props.fontSize || '20pt'}}>{props.value}</div>
      </Link>
    </div>
  )
}