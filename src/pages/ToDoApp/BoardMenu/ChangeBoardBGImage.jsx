import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { changeBoardBG } from '../../../redux/action/createBoard';

export default function ChangeBoardBackground({backgroundChange}) {
    
    const currentBoardIndex = useSelector(({currentBoard}) => currentBoard.current);

    const [backgrounds, setBackgrounds] = useState('');
    const [backgroundSearch, setBackgroundSearch] = useState('abstract')
    const dispatch = useDispatch();

    useEffect(() => {
        console.count('render')
        let clientId = 'wCcT1rchu94wC7v-SOkXYFVHZesXcYqvJGEjG8oQjcM';
        let url = 
        "https://api.unsplash.com/search/photos/?client_id=" +
        clientId + 
        `&query=${backgroundSearch}` +
        "&per_page=20";
        fetch(url)
            .then(function(data) {
                console.log('1')
                return data.json();
            })
            .then(function(data){
                setBackgrounds(data)
            })
    }, []);
    // const newBoardImage = (currentBoardIndex, regualarImage, smallImage) => {
    //     dispatch(changeBoardBG(currentBoardIndex, regualarImage, smallImage, ''))
    // }

    const changeSearchText = (text) => {
        setBackgroundSearch(text)
    }

    return (
        <div className="background">
            <div className="background__block">
                <div className="background__search">
                    <span>Поиск фото</span>
                    <input type="text" onChange={(e) => changeSearchText(e.target.value)} />
                </div>
                <div className="background__list">
                    { backgrounds.results ?
                        backgrounds.results.map((item, index) => (
                            <div className="background__item" key={index} >
                                <img src={item.urls.small} alt="" />
                            </div>
                        ))
                        : ''
                    }
                    
                </div>
            </div>
        </div>
    )
}