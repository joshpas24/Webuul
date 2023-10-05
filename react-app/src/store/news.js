
const GET_NEWS = "news/GET_NEWS"
const GET_NEWS_TOPICS = "news/GET_NEWS_TOPICS"

const getNews = (data) => ({
    type: GET_NEWS,
    data
})

const getNewsTopics = (data) => ({
    type: GET_NEWS_TOPICS,
    data
})

export const thunkGetNews = () => async (dispatch) => {
    const res = await fetch(`/api/news/latest`, {
        method: "GET"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(getNews(data))
        return data;
    }
}

export const thunkGetNewsTopics = (topics) => async (dispatch) => {
    const res = await fetch("/api/news/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getNewsTopics(data))
        return data
    }
}

let initialState = { all: [], query: [] }

export default function newsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_NEWS:
            newState = { ...state, all: [] }
            newState.all = action.data
            return newState;
        case GET_NEWS_TOPICS:
            newState = { ...state, query: [] }
            newState.query = action.data
            return newState
        default:
            return state;
    }
}
