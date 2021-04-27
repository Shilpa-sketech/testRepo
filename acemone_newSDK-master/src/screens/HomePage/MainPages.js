export const  getHome =()=> {
    return (
    
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View
                style={{ flex: 1.5, width: '100%', justifyContent: 'center', paddingLeft: 20, paddingRight: 100 }}
            >
                {this.state.profileLoading == true ? (
                    <DotIndicator
                        size={6}
                        color={'grey'}
                        animating={this.props.animating}
                        hidesWhenStopped={true}
                        style={{ alignSelf: 'flex-start', paddingLeft: 20 }}
                    />
                ) : (
                    <Text numberOfLines={1} style={{ fontSize: 20, color: 'grey' }}>
                        {' '}
                        {this.state.agentName !== '' ? 'Hi , ' + this.state.agentName : 'Hi , User'}
                    </Text>
                )}
            </View>
        
            <View style={{ flex: 10, width: '100%' }}>
            
                   <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
    <View style={styles.slide1}>
    <View style={{flex:1,width:'100%'}}>
                <FlatList
                    numColumns={2}
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5 }}
                    data={[
                        {
                            name: 'Money Withdrawal\n\t\t\t\t(QR Code)',
                            pageDepth: 1,
                            iconName: 'scan1',
                            iconType: 'antdesign',
                        },
                        { name: 'Withdrawal Reports', pageDepth: -1, iconName: 'filetext1', iconType: 'antdesign' },
                        {
                            name: 'Connect To Micro-Atm Device',
                            pageDepth: 4,
                            iconName: 'scanner',
                            iconType: 'material-community',
                        },
                        {
                            name: 'Micro-Atm Transaction History',
                            pageDepth: 5,
                            iconName: 'files-o',
                            iconType: 'font-awesome',
                        },
                    ]}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index, separators }) => (
                        <View
                            style={{
                                height: 200,
                                width: SCREEN_WIDTH / 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <LinearGradient
                                colors={['#4075D3', '#3361B4']}
                                style={{ height: '90%', width: '90%', borderRadius: 8, padding: 10 }}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1, width: '100%' }}
                                    onPress={() => {
                                        this.onPressFunction(item.pageDepth);
                                    }}
                                >
                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon
                                            size={80}
                                            name={item.iconName}
                                            type={item.iconType}
                                            color={'#fff'}
                                            underlayColor="rgba(255,255,255,0)"
                                        />
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    )}
                />
                </View>
    </View>
    <View style={styles.slide2}>
    <View style={{flex:1,width:'100%'}}>
                <FlatList
                    numColumns={2}
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5 }}
                    data={[
                        {
                            name: 'Bill Payments',
                            pageDepth: 6,
                            iconName: 'credit-card',
                            iconType: 'font-awesome',
                        },
                        { name: '\t\t\t Recharge\n(Mobile And Dth)', pageDepth: 7, iconName: 'plussquareo', iconType: 'antdesign' },
                        {
                            name: 'Money Transfer',
                            pageDepth: 8,
                            iconName: 'exchange',
                            iconType: 'font-awesome',
                        },
                        {
                            name: 'Settlements',
                            pageDepth: 9,
                            iconName: 'Safety',
                            iconType: 'antdesign',
                        },
                    ]}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index, separators }) => (
                        <View
                            style={{
                                height: 200,
                                width: SCREEN_WIDTH / 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <LinearGradient
                                colors={['#4075D3', '#3361B4']}
                                style={{ height: '90%', width: '90%', borderRadius: 8, padding: 10 }}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1, width: '100%' }}
                                    onPress={() => {
                                        this.onPressFunction(item.pageDepth);
                                    }}
                                >
                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon
                                            size={80}
                                            name={item.iconName}
                                            type={item.iconType}
                                            color={'#fff'}
                                            underlayColor="rgba(255,255,255,0)"
                                        />
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    )}
                />
                </View>
    </View>
   
  </Swiper>
            </View>

            {/* <LinearGradient colors={['#00000090', 'grey']} style={{height:100,width:'95%',backgroundColor:'#00000090',marginBottom:15,borderRadius:6}}>
    <TouchableOpacity onPress={()=>{
      this.setState({changingPage:true,settingsLoading:true,previousDepth:this.state.pageDepth,},()=>{
        setTimeout(()=>{
          this.setState({pageDepth:1,settingsLoading:false,changingPage:false})
        },100)
        
      })
      
     }} style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}> 
     <Text style={{color:'#fff',fontSize:20}}>Money Withdrawal Using QR Code</Text>
    </TouchableOpacity>
    
    </LinearGradient>
    

    <LinearGradient colors={['#00000090', 'grey']}  style={{height:100,width:'95%',backgroundColor:'#00000090',marginTop:15,borderRadius:6}}>
    <TouchableOpacity onPress={()=>{
      this.setState({changingPage:true,settingsLoading:true,previousDepth:this.state.pageDepth},()=>{
        setTimeout(()=>{
          this.setState({pageDepth:-1,settingsLoading:false,changingPage:false},()=>{
            this.getReportHistoryData()
          })
        },100)
        
      })
       
     }} style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}> 
    <Text style={{color:'#fff',fontSize:20}}>Withdrawal Reports</Text>
    </TouchableOpacity>
    </LinearGradient> */}
        </View>
    );
}