const add =(a)=> {
    return a+5;
}

const Test = () => {
    const x = add(5);
    return (<div>{x}</div>)
}

export default Test;