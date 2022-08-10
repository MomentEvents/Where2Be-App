const fetchData = async () => {
    const resp = await fetch('http://mighty-chamber-83878.herokuapp.com/interests', {
        method: 'GET',
    });

    const data = await resp.json();
    // console.log(data,"resp data")
    
    
    

    // const resp2 = await fetch('http://mighty-chamber-83878.herokuapp.com/import_interest_list', {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         id: 'user_1'
    //     })
    // });
    const inTags = await resp2.json();
    // console.log(inTags, "selected data")

    
    

    for (var i = 0; i < inTags.length; i++) {
        outTags[inTags[i]] = true
    }

    setInTags(inTags);
    setData(data);

    setLoading(false);
};