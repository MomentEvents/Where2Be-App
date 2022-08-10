// export default function  YourApp(){
//   const [data, setData] = useState([]);
//   const [data2, setData2] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const [type, setType] = useState("Instagram");
//   var type = "Instagram";
//   var type2 = "Discord";
//   var test_data = [];

//   async function loadText(type_name) {
//     // let obj;
//     let jsondata;    
//     const resp = await fetch('http://10.0.2.2:3000/log', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         user: type_name,
//         password: 'testpassword'
//       })
//     })
//     .then(
//       function(u){return u.json();}
//     ).then(
//       function(json){
//         jsondata = json;
//       }
//     )
//     // const data_test = await resp.json();
//     console.log("WHy");
//     // console.log(jsondata);
//     // console.log(jsondata);
//     // console.log(JSON.stringify(data_test));
//     // data1 = JSON.stringify(obj);
//     // console.log(data1);
//     // console.log(JSON.stringify(obj));
//     return (
//       <Text>HHHHHHH</Text>
//     );

//   }

//   const fetchData = async () => {
//     // const resp = await fetch("http://10.0.2.2:3000/data");
//     // const data = await resp.json();

//     const resp = await fetch('http://10.0.2.2:3000/log', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         user: type,
//         password: 'testpassword'
//       })
//     });

//     console.log("here")
//     const data = await resp.json();

//     console.log(data);

//     const resp2 = await fetch('http://10.0.2.2:3000/log', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         user: type2,
//         password: 'testpassword'
//       })
//     });
//     console.log("here")
//     const data2 = await resp2.json();
//     console.log(data2);

//     setData(data);
//     setData2(data2);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [type, type2]);

//   const test_fn = (type_name) => {
//     // type = type_name;
//     console.log(loadText("Instagram"));
//     // abc = type_name;
//     // loadText;
//     // const dtt = loadText();
//     // console.log(dtt);
//   }

//   const renderItem = ({ item }) => {
//     return (
//       // <Box px={5} py={2} rounded="md" bg="primary.300" my={2}>
//       //   {item.title}
//       // </Box>
//       <Text>
//         {/* here */}
//         {item.title}
//         {/* {item.description} */}
//       </Text>
//     );
//   };
//   console.log(type)

//   return (
//     <NativeBaseProvider>
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>
//         Try editing me! 🎉
//       </Text> 
//       <Text>
//         {/* {test_fn("Discord")} */}
//         <Center flex={1}>
//         <Box> Fetch API</Box>
//           {loading && <Box>Loading..</Box>}
//           {data && (
//             <FlatList
//               data={data}
//               renderItem={renderItem}
//               keyExtractor={(item) => item.id.toString()}
//             />
//           )}
//         </Center>
//       </Text> 
//       {/* </Text> */}
//       <Text>
//       <Center flex={1}>
//         <Box> Fetch API</Box>
//           {loading && <Box>Loading..</Box>}
//           {data2 && (
//             <FlatList
//               data={data2}
//               renderItem={renderItem}
//               keyExtractor={(item) => item.id.toString()}
//             />
//           )}
//         </Center>
//       </Text>

//       {/* {test_fn("Instagram")} */}
//     </View>
//     </NativeBaseProvider>
//   );
// }
