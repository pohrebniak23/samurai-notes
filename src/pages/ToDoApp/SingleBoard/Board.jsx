import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from "react-router-dom";
import styled from 'styled-components';
import CreateNewList from './CreateNewList';
import CreateNewCard from './CreateNewCard';
import { cardDelete, listDelete, changeListTitle, createCardInPosition } from '../../../redux/action/createBoard';
import deleteBtn from '../../../assets/img/delete-btn.svg'
import BoardMenu from '../BoardMenu/BoardMenu';
import { IoSettingsOutline } from 'react-icons/io5';
import './board.sass';

const BoardBg = styled.div`
    background: ${(props) => {
        if (props.currentBoard.boardImage[0].colors && props.currentBoard.boardImage[0].colors.length < 4) {
            return `linear-gradient(to right, ${props.currentBoard.boardImage[0].colors[0]}, ${props.currentBoard.boardImage[0].colors[1]})`
        } else if (props.currentBoard.boardImage[0].colors && props.currentBoard.boardImage[0].colors.length > 4) {
            return props.currentBoard.boardImage[0].colors;
        } else {
            return '#F2F2F2';
        }
    }}
`;

function Board({wrapRef}) {

    const slug = useParams();
    const dispatch = useDispatch();
    const boardItem = useSelector(({boards}) => boards.boardItem);
    
    // Определение текущей доски
    let currentBoard = '';
    boardItem.map(item => {
        if (item.id == Number(slug.id)) {
            return currentBoard = item
        }
        return currentBoard;
    })
    

    // Изменение заголовка списка
    const listTitleChange = (value, listIndex) => {
        dispatch(changeListTitle(value, listIndex, boardItem[slug].id))
    }

    // Удаление списков и карточек
    const cardDeleteSender = (boardId, listId, cardId) => {
        dispatch(cardDelete(boardId, listId, cardId));
    }

    const listDeleteSender = (boardId, listId) => {
        dispatch(listDelete(boardId, listId));
    }

    // ----- Открытие настроек доски -----

    const [boardMenuOpen, setBoardMenuOpen] = useState(false);

    const changeBoardMenuOpen = () => {
        setBoardMenuOpen(!boardMenuOpen);
    }


    // ----- Drag and Drop ------

    const [currentList, setCurrentList] = useState();
    const [currentCard, setCurrentCard] = useState();

    // function dragOverHandler(e) {
    //     e.preventDefault();  
    //     if (e.target.parentElement.classList.contains('board-list__card-block') || e.target.parentElement.classList.contains('board-list__card-hide')) {
    //         // e.target.parentElement.style.height = '100px'
    //         // e.target.style.boxShadow = '0 2px 3px gray'
    //         e.target.parentElement.classList.add('board-list__paste')
    //     } else {
    //         console.log('12')
    //     }
    // }

    function dragOverHandler1(e) {
        e.preventDefault();   
        e.target.parentElement.classList.add('board-list__paste')
    }

    function dragLeaveHandler1(e) {
        // e.target.classList.remove('board-list__paste')
        e.target.parentElement.classList.remove('board-list__paste')
    }

    // function dragLeaveHandler(e) {
    //     if (e.target.parentElement.querySelector('.board-list__card-hide')) {
    //         e.target.parentElement.removeChild(document.querySelector('.board-list__card-hide'))
    //     }
        
    // }

    function dragStartHandler(e, board, item) {
        setCurrentList(board);
        setCurrentCard(item)
    }

    function dragEndHandler(e) {
        e.target.parentElement.classList.remove('board-list__paste')
    }
    
    function dropHandler(e, card, item) {
        e.preventDefault();  
        
        if (e.target.classList.contains('board-list__card-content')) {
            const currentIndex = currentList.listItem.map(function (e) {return e.cardId}).indexOf(currentCard.cardId);
            dispatch(cardDelete(slug, currentList.listId, currentIndex))
            let dropIndex = card.listItem.indexOf(item)
            dispatch(createCardInPosition(currentCard.cardName, card.listId, slug, dropIndex));
            e.target.parentElement.classList.remove('board-list__paste')
        }
    }
    

    // function dropCardHandler(e, card, board) {
    //     e.preventDefault();  
        
    //     if (!e.target.classList.contains('board-list__card-content')) {
    //         const currentIndex = currentList.listItem.map(function (e) {return e.cardId}).indexOf(currentCard.cardId);
    //         dispatch(cardDelete(slug, currentList.listId, currentIndex))
    //         dispatch(createCard(currentCard.cardName, card.listId, slug));
    //         e.target.parentElement.classList.remove('board-list__paste')
    //     }
    // }

    // ----- Настройка прокрутки списка -----

    const boardRef = useRef(null);
    const listRef = useRef(null);
    
    useEffect(() => {
        console.log(wrapRef)
        setTimeout(() => {
            if (listRef.current.scrollWidth > wrapRef.current.clientWidth - 280 - 300) {
                listRef.current.style.overflowX = "scroll"
            } else {
                listRef.current.style.overflowX = "unset"
            }
        }, 10)
    }, [changeBoardMenuOpen])

    useEffect(() => {
        boardRef.current.style.maxWidth = wrapRef.current.clientWidth - 280 + 'px';
    }, [])

    return (
        <div className={boardMenuOpen ? "board board_small" : "board"} ref={boardRef} >
            {
                !currentBoard.boardImage[0].regular
                ? <div className="board__background board__background_hide"></div>
                : <img src={currentBoard.boardImage[0].regular} alt="" className="board__background"/>
            }
            {
                !currentBoard.boardImage[0].colors
                ? <div className="board__background board__background_hide"></div>
                : <BoardBg currentBoard={currentBoard} className="board__background"></BoardBg>
            }
            
            <div className={boardMenuOpen ? "board__block board__block_small" : "board__block"} >
                <div className="board__nav">
                    <h1 className="board__title">
                        {currentBoard.title}
                    </h1>
                    <button className={boardMenuOpen ? "board__menu-open board__menu-open_hide" : "board__menu-open"} onClick={changeBoardMenuOpen}>
                        <IoSettingsOutline className="board__menu-open_icon" />
                        <span>
                            Настройки доски
                        </span>
                    </button>
                </div>
                <div className="board__subtitle">
                    <h2>
                        Нажмите на <span>Новый список</span> чтобы создать новый список
                    </h2>
                    <h2>
                        Нажмите на <span>+</span> чтобы создать новую заметку
                    </h2>
                </div>
                <div className="board-list" ref={listRef}>
                    {
                        currentBoard.list.map((item, listIndex) => (
                            <div className="board-list__item" key={listIndex}
                                // onDragOver={(e) => dragOverHandler(e)}
                                // onDrop={(e) => dropCardHandler(e, item)}
                            >             
                                <textarea type="text" className="board-list__search" value={item.listTitle} onChange={(e) => {listTitleChange(e.target.value, listIndex)}}  />
                                <div className="board-list__delete-list" onClick={() => listDeleteSender(slug, listIndex)}>
                                    <img src={deleteBtn} alt="" />
                                </div>           
                                {
                                    item.listItem.map((card, cardIndex) => (
                                        <div className="board-list__card" key={cardIndex} draggable={true}
                                            onDragOver={(e) => dragOverHandler1(e)}
                                            onDragLeave={(e) => dragLeaveHandler1(e)}
                                            onDragStart={(e) => dragStartHandler(e, item, card)}
                                            onDragEnd={(e) => dragEndHandler(e)}
                                            onDrop={(e) => dropHandler(e, item, card)}
                                        >
                                            <div className="board-list__card-block">
                                                <div className="board-list__card-content">
                                                    {card.cardName}
                                                    <div className="board-list__delete-card" onClick={() => cardDeleteSender(slug, listIndex, cardIndex)}>
                                                        <img src={deleteBtn} alt="" />
                                                    </div>
                                                </div>
                                                <div className="board-list__card-hide"></div>
                                            </div>
                                        </div>
                                    ))
                                }
                                <CreateNewCard item={item} slug={Number(slug.id)} listIndex={listIndex} />
                            </div>
                        ))
                    }
                    <CreateNewList />
                    {/* <Link className="board-list__back" to="/Notes">Назад к заметкам</Link> */}
                </div>
            </div>
            <BoardMenu boardMenuStatus={boardMenuOpen} setBoardMenuStatus={setBoardMenuOpen} />
        </div>
    )
}

export default Board;
