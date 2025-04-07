document.addEventListener('DOMContentLoaded', function() {
    const characterNameInput = document.getElementById('characterName');
    const headcanonElement = document.getElementById('headcanon');
    const headcanonContainer = document.querySelector('.headcanon-container');
    const generateBtn = document.getElementById('generateBtn');
    const saveStoryBtn = document.getElementById('saveStoryBtn');
    const themeSelector = document.getElementById('themeSelector');
    const attributesContainer = document.getElementById('characterAttributes');
    
    // 故事进度点
    const progressDots = [
        document.getElementById('dot1'),
        document.getElementById('dot2'),
        document.getElementById('dot3'),
        document.getElementById('dot4')
    ];
    
    // 故事进度线
    const progressLines = document.querySelectorAll('.progress-line');
    
    // 存储当前故事内容
    let currentStory = [];
    let currentCharacter = '';
    let storyCompleted = false;
    // 添加角色属性变量
    let characterAttributes = {};
    let currentTheme = 'standard';

    // 预加载动画效果
    setTimeout(() => {
        characterNameInput.focus();
    }, 1000);

    // 角色设定列表（英文版）
    const headcanons = [
        "This character cracks their knuckles very loudly.",
        "This character has a secret diary no one knows about.",
        "This character always wakes up early to watch the sunrise.",
        "This character collects oddly shaped rocks.",
        "This character is afraid of thunderstorms.",
        "This character enjoys walking in the rain.",
        "This character has a song they always hum.",
        "This character has a sweet tooth.",
        "This character reads before going to bed every night.",
        "This character has a lucky charm they never part with.",
        "This character is very good at telling jokes.",
        "This character often forgets important dates.",
        "This character is good at mimicking other people's voices.",
        "This character has a hidden musical talent.",
        "This character likes to collect old photographs.",
        "This character has a special way of organizing things.",
        "This character is afraid of spiders.",
        "This character covers their eyes during horror movies.",
        "This character snacks at midnight.",
        "This character bites their nails when nervous.",
        "This character loves watching the stars at night.",
        "This character writes poetry when no one is looking.",
        "This character has a favorite mug they always use.",
        "This character talks to plants and believes it helps them grow.",
        "This character can't sleep without a specific pillow.",
        "This character secretly practices dance moves in front of the mirror.",
        "This character has memorized their favorite book/movie word for word.",
        "This character pretends to understand art at galleries.",
        "This character names all their electronic devices.",
        "This character makes up songs about everyday tasks."
    ];
    
    // 故事开始模板
    const storyBeginnings = [
        "One day, NAME was walking down the street when suddenly...",
        "NAME never expected that today would be different from any other day, until...",
        "It all started when NAME woke up to find something unusual...",
        "NAME had always been ordinary, until that fateful morning when...",
        "The adventure began when NAME received a mysterious package...",
        "NAME was minding their own business when a strange noise caught their attention...",
        "Everything changed for NAME on that rainy Tuesday afternoon..."
    ];
    
    // 故事中间部分模板
    const storyMiddles = [
        "Surprisingly, this led to an unexpected discovery that...",
        "This created quite a problem, especially when...",
        "What happened next was completely unexpected...",
        "Little did they know, this would lead to meeting someone who...",
        "This strange event reminded them of something they had forgotten long ago...",
        "The situation quickly escalated when...",
        "This put NAME in a difficult position, forcing them to decide..."
    ];
    
    // 故事结局模板
    const storyEndings = [
        "In the end, NAME learned an important lesson about themselves.",
        "Finally, everything made sense, and NAME couldn't help but smile.",
        "After everything that happened, NAME would never look at things the same way again.",
        "And that's how NAME discovered a talent they never knew they had.",
        "Looking back, NAME realized this was just the beginning of a much bigger adventure.",
        "When all was said and done, NAME returned home with a new perspective on life.",
        "That night, NAME went to sleep knowing that tomorrow would bring new possibilities."
    ];

    // 按键事件监听
    characterNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateHeadcanon();
        }
    });

    // 点击按钮生成设定
    generateBtn.addEventListener('click', generateHeadcanon);
    
    // 初始化进度条
    updateProgressIndicators(0);

    // 初始化主题
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            currentTheme = this.value;
            // 如果已经有角色，更新头像
            if (currentCharacter) {
                // 更新头像
                generateCharacterAvatar(currentCharacter);
            }
        });
    }

    // 获取初始主题
    if (themeSelector) {
        currentTheme = themeSelector.value || 'standard';
    }

    // 添加保存故事功能
    if (saveStoryBtn) {
        console.log("保存按钮存在，添加点击事件监听器");
        saveStoryBtn.addEventListener('click', function() {
            console.log("保存按钮被点击");
            saveStory();
        });
    } else {
        console.log("保存按钮不存在!");
    }

    function generateHeadcanon() {
        const name = characterNameInput.value.trim();
        
        if (name === '') {
            headcanonElement.textContent = 'Please enter a character name!';
            headcanonContainer.classList.add('shake');
            setTimeout(() => {
                headcanonContainer.classList.remove('shake');
            }, 500);
            return;
        }
        
        // 隐藏保存按钮（重新开始故事时）
        if (saveStoryBtn) {
            saveStoryBtn.classList.add('hidden');
        }
        storyCompleted = false;
        
        // 当角色名称改变时，重置故事
        if (currentCharacter !== name) {
            currentCharacter = name;
            currentStory = [];
            
            // 生成角色属性
            characterAttributes = generateCharacterAttributes(name);
            
            // 随机选择一个设定作为角色特征
            const randomIndex = Math.floor(Math.random() * headcanons.length);
            const selectedHeadcanon = headcanons[randomIndex];
            const personalizedHeadcanon = selectedHeadcanon.replace("This character", name);
            
            // 开始故事
            const beginningIndex = Math.floor(Math.random() * storyBeginnings.length);
            const beginningText = storyBeginnings[beginningIndex].replace(/NAME/g, name);
            
            currentStory.push(personalizedHeadcanon);
            currentStory.push(beginningText);
            
            // 显示角色属性卡片
            displayCharacterAttributes();
            
            // 更新进度条
            updateProgressIndicators(currentStory.length);
        } 
        else {
            // 继续现有故事
            if (currentStory.length === 2) {
                // 添加中间部分
                const middleIndex = Math.floor(Math.random() * storyMiddles.length);
                const middleText = storyMiddles[middleIndex].replace(/NAME/g, name);
                currentStory.push(middleText);
                
                // 更新进度条
                updateProgressIndicators(currentStory.length);
            } 
            else if (currentStory.length === 3) {
                // 添加结尾
                const endingIndex = Math.floor(Math.random() * storyEndings.length);
                const endingText = storyEndings[endingIndex].replace(/NAME/g, name);
                currentStory.push(endingText);
                
                // 标记故事已完成
                storyCompleted = true;
                
                // 显示保存故事按钮
                if (saveStoryBtn) {
                    saveStoryBtn.classList.remove('hidden');
                    console.log("故事完成，保存按钮已显示");
                } else {
                    // 如果按钮不存在，尝试重新获取
                    const saveBtn = document.getElementById('saveStoryBtn');
                    if (saveBtn) {
                        saveBtn.classList.remove('hidden');
                        console.log("通过重新获取显示保存按钮");
                    } else {
                        console.log("无法找到保存按钮");
                    }
                }
                
                // 更新进度条
                updateProgressIndicators(currentStory.length);
            } 
            else {
                // 故事已完成，重新开始
                currentStory = [];
                
                // 生成角色属性
                characterAttributes = generateCharacterAttributes(name);
                
                // 随机选择一个设定作为角色特征
                const randomIndex = Math.floor(Math.random() * headcanons.length);
                const selectedHeadcanon = headcanons[randomIndex];
                const personalizedHeadcanon = selectedHeadcanon.replace("This character", name);
                
                // 开始新故事
                const beginningIndex = Math.floor(Math.random() * storyBeginnings.length);
                const beginningText = storyBeginnings[beginningIndex].replace(/NAME/g, name);
                
                currentStory.push(personalizedHeadcanon);
                currentStory.push(beginningText);
                
                // 显示角色属性卡片
                displayCharacterAttributes();
                
                // 更新进度条
                updateProgressIndicators(currentStory.length);
            }
        }
        
        // 应用动画效果
        headcanonContainer.classList.add('headcanon-highlight');
        setTimeout(() => {
            headcanonContainer.classList.remove('headcanon-highlight');
        }, 1000);
        
        // 显示故事
        displayStory();

        // 按钮反馈效果
        generateBtn.classList.add('btn-clicked');
        setTimeout(() => {
            generateBtn.classList.remove('btn-clicked');
        }, 200);
        
        // 更新按钮文字
        updateButtonText();
    }
    
    function displayStory() {
        // 将故事显示在页面上
        headcanonElement.innerHTML = currentStory.join('<br><br>');
        
        // 滚动到底部
        headcanonContainer.scrollTop = headcanonContainer.scrollHeight;
    }
    
    function updateButtonText() {
        // 根据故事进度更新按钮文字
        if (currentStory.length === 0 || currentStory.length === 4) {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Create New Headcanon';
        } else if (currentStory.length === 1) {
            generateBtn.innerHTML = '<i class="fas fa-book-open"></i> Begin Headcanon';
        } else if (currentStory.length === 2) {
            generateBtn.innerHTML = '<i class="fas fa-book-reader"></i> Continue Headcanon';
        } else if (currentStory.length === 3) {
            generateBtn.innerHTML = '<i class="fas fa-book"></i> Finish Headcanon';
        }
    }
    
    function updateProgressIndicators(step) {
        // 重置所有点和线
        progressDots.forEach(dot => dot.classList.remove('active'));
        Array.from(progressLines).forEach(line => line.classList.remove('active'));
        
        // 激活当前进度
        for (let i = 0; i < step; i++) {
            progressDots[i].classList.add('active');
            
            // 为点之间的线添加active类
            if (i < step - 1) {
                progressLines[i].classList.add('active');
            }
        }
    }
    
    // 生成角色头像
    function generateCharacterAvatar(name) {
        // 使用名称的哈希值确定头像风格
        const nameHash = getStringHash(name);
        
        // 备用背景颜色（万一图像加载失败）
        const colorHue = nameHash % 360;
        const backgroundColor = `hsl(${colorHue}, 70%, 60%)`;
        
        // 确定角色性别（基于名称哈希）
        // 你可以根据需要调整这个逻辑
        const isMale = (nameHash % 2 === 0);
        const gender = isMale ? 'male' : 'female';
        
        // 获取角色年龄（从characterAttributes中）
        const age = characterAttributes ? characterAttributes.age : 'adult';
        
        setTimeout(() => {
            const avatarElement = document.getElementById('characterAvatar');
            if (avatarElement) {
                // 清空之前的内容
                avatarElement.textContent = '';
                avatarElement.classList.add('loading');
                
                // 构建基于年龄和性别的本地图像路径
                const maxAvatarCount = gender === 'male' ? 11 : 5; // 男性有11个头像，女性有5个
                const avatarNumber = (nameHash % maxAvatarCount) + 1;
                const avatarPath = `images/avatars/${age}/${gender}/avatar${avatarNumber}.jpeg`;
                
                // 显示头像
                avatarElement.style.backgroundImage = `url('${avatarPath}')`;
                
                // 如果本地图像加载失败，使用基于名称的网络头像作为备用
                const img = new Image();
                img.onload = function() {
                    avatarElement.classList.remove('loading');
                    avatarElement.classList.add('loaded');
                };
                img.onerror = function() {
                    console.log("本地头像加载失败，使用备用网络头像");
                    
                    // 备用：使用根据名称生成的在线头像
                    const imageId = (nameHash % 100) + 1;
                    const genderStr = gender === 'male' ? 'men' : 'women';
                    const backupUrl = `https://randomuser.me/api/portraits/${genderStr}/${imageId}.jpg`;
                    
                    const backupImg = new Image();
                    backupImg.onload = function() {
                        avatarElement.style.backgroundImage = `url('${backupUrl}')`;
                        avatarElement.classList.remove('loading');
                        avatarElement.classList.add('loaded');
                    };
                    backupImg.onerror = function() {
                        // 如果在线头像也失败，回退到字母头像
                        avatarElement.style.backgroundImage = 'none';
                        avatarElement.style.backgroundColor = backgroundColor;
                        avatarElement.textContent = name.charAt(0).toUpperCase();
                        avatarElement.classList.remove('loading');
                        avatarElement.classList.add('loaded');
                    };
                    backupImg.src = backupUrl;
                };
                img.src = avatarPath;
            }
        }, 100);
    }
    
    // 获取当前主题对应的头像风格
    function getAvatarStyle() {
        const styles = {
            'standard': 'avataaars',
            'fantasy': 'adventurer-neutral',
            'scifi': 'bottts',
            'mystery': 'micah',
            'romance': 'lorelei'
        };
        return styles[currentTheme] || 'avataaars';
    }
    
    // 根据角色属性获取头像参数
    function getAvatarParams() {
        const params = {};
        
        // 设置默认背景色
        params.backgroundColor = ['transparent'];
        
        // 如果没有角色属性，返回默认参数
        if (!characterAttributes) return params;
        
        // 根据角色属性配置参数
        // 性格影响头像风格
        if (characterAttributes.personality === 'compassionate') {
            params.eyes = ['happy'];
            params.eyebrows = ['raised'];
            params.mouth = ['smile'];
        } else if (characterAttributes.personality === 'introverted') {
            params.eyes = ['default'];
            params.eyebrows = ['default'];
            params.mouth = ['serious'];
        } else if (characterAttributes.personality === 'extroverted') {
            params.eyes = ['wink'];
            params.eyebrows = ['raised'];
            params.mouth = ['smile'];
        }
        
        // 年龄影响头发和穿着
        if (characterAttributes.age === 'elderly') {
            params.hairColor = ['gray', 'white'];
            params.top = ['shortCurly', 'shortWaved'];
        } else if (characterAttributes.age === 'teenage') {
            params.top = ['longHair', 'dreads', 'frizzle'];
        }
        
        // 弱点影响表情
        if (characterAttributes.weakness === 'impatience') {
            params.eyebrows = ['angry'];
        } else if (characterAttributes.weakness === 'perfectionism') {
            params.eyebrows = ['serious'];
        }
        
        // 目标影响风格
        if (characterAttributes.goal === 'seeking adventure') {
            params.clothingColor = ['red', 'orange'];
        } else if (characterAttributes.goal === 'finding love') {
            params.clothingColor = ['pink', 'red'];
        }
        
        // 强项影响特征
        if (characterAttributes.strengths.includes('creativity')) {
            params.accessories = ['round'];
        } else if (characterAttributes.strengths.includes('intelligence')) {
            params.accessories = ['prescription01', 'prescription02'];
        }
        
        return params;
    }
    
    // 使用SVG创建头像
    function createAvatarSVG(style, params, element, name) {
        // 使用角色名字作为随机种子
        const seed = name + (characterAttributes ? characterAttributes.personality : '');
        
        // 根据选择的风格创建不同SVG
        let svgContent = '';
        
        // 使用本地内嵌SVG模板
        if (style === 'avataaars') {
            // 设置随机参数
            const nameHash = getStringHash(name);
            const options = {
                topType: ['NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'],
                accessoriesType: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
                hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
                facialHairType: ['Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
                clotheType: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'],
                eyeType: ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
                eyebrowType: ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'],
                mouthType: ['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
                skinColor: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']
            };
            
            // 应用角色属性覆盖默认选项
            if (params.top) {
                options.topType = params.top.map(type => {
                    // 将我们的简化参数映射到DiceBear的实际参数名
                    const typeMap = {
                        'shortCurly': 'ShortHairShortCurly',
                        'shortWaved': 'ShortHairShortWaved',
                        'longHair': 'LongHairBigHair',
                        'dreads': 'LongHairDreads',
                        'frizzle': 'ShortHairFrizzle'
                    };
                    return typeMap[type] || type;
                });
            }
            
            if (params.accessories) {
                options.accessoriesType = params.accessories.map(type => {
                    const typeMap = {
                        'round': 'Round',
                        'prescription01': 'Prescription01',
                        'prescription02': 'Prescription02'
                    };
                    return typeMap[type] || type;
                });
            }
            
            if (params.eyes) {
                options.eyeType = params.eyes.map(type => {
                    const typeMap = {
                        'happy': 'Happy',
                        'default': 'Default',
                        'wink': 'Wink'
                    };
                    return typeMap[type] || type;
                });
            }
            
            if (params.eyebrows) {
                options.eyebrowType = params.eyebrows.map(type => {
                    const typeMap = {
                        'angry': 'Angry',
                        'raised': 'RaisedExcited',
                        'default': 'Default',
                        'serious': 'SadConcerned'
                    };
                    return typeMap[type] || type;
                });
            }
            
            if (params.mouth) {
                options.mouthType = params.mouth.map(type => {
                    const typeMap = {
                        'smile': 'Smile',
                        'serious': 'Serious'
                    };
                    return typeMap[type] || type;
                });
            }
            
            if (params.hairColor) {
                options.hairColor = params.hairColor.map(color => {
                    const colorMap = {
                        'gray': 'SilverGray',
                        'white': 'Platinum'
                    };
                    return colorMap[color] || color;
                });
            }
            
            if (params.clothingColor) {
                // 转换为API可接受的颜色格式
                const colorMap = {
                    'red': 'Red',
                    'orange': 'Orange',
                    'pink': 'Pink'
                };
                
                // clothingColor 在avataaars中没有直接对应，使用SVG过滤器实现
                // 为简化，我们只使用预定义的颜色
            }
            
            // 根据哈希值为每个特征选择一个选项
            const topType = options.topType[nameHash % options.topType.length];
            const accessoriesType = options.accessoriesType[nameHash % options.accessoriesType.length];
            const hairColor = options.hairColor[(nameHash * 3) % options.hairColor.length];
            const facialHairType = options.facialHairType[(nameHash * 5) % options.facialHairType.length];
            const clotheType = options.clotheType[(nameHash * 7) % options.clotheType.length];
            const eyeType = options.eyeType[(nameHash * 11) % options.eyeType.length];
            const eyebrowType = options.eyebrowType[(nameHash * 13) % options.eyebrowType.length];
            const mouthType = options.mouthType[(nameHash * 17) % options.mouthType.length];
            const skinColor = options.skinColor[(nameHash * 19) % options.skinColor.length];
            
            // 从官方CDN加载头像
            const apiUrl = `https://avatars.dicebear.com/api/avataaars/${encodeURIComponent(seed)}.svg?top[]=${topType}&accessories[]=${accessoriesType}&hairColor[]=${hairColor}&facialHair[]=${facialHairType}&clothes[]=${clotheType}&eyes[]=${eyeType}&eyebrows[]=${eyebrowType}&mouth[]=${mouthType}&skin[]=${skinColor}`;
            
            // 加载并显示头像
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('头像加载失败');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    element.style.backgroundImage = `url('${url}')`;
                    element.textContent = '';
                    element.classList.remove('loading');
                    element.classList.add('loaded');
                })
                .catch(error => {
                    console.error('获取头像出错:', error);
                    // 使用首字母作为备用
                    element.style.backgroundImage = 'none';
                    element.style.backgroundColor = backgroundColor;
                    element.textContent = name.charAt(0).toUpperCase();
                    element.classList.remove('loading');
                    element.classList.add('loaded');
                });
        }
        else {
            // 对于其他风格，使用简化的API调用
            const apiUrl = `https://avatars.dicebear.com/api/${style}/${encodeURIComponent(seed)}.svg`;
            
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('头像加载失败');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    element.style.backgroundImage = `url('${url}')`;
                    element.textContent = '';
                    element.classList.remove('loading');
                    element.classList.add('loaded');
                })
                .catch(error => {
                    console.error('获取头像出错:', error);
                    // 使用首字母作为备用
                    element.style.backgroundImage = 'none';
                    element.style.backgroundColor = backgroundColor;
                    element.textContent = name.charAt(0).toUpperCase();
                    element.classList.remove('loading');
                    element.classList.add('loaded');
                });
        }
    }

    // 生成角色属性
    function generateCharacterAttributes(name) {
        const attributes = {};
        
        // 年龄范围
        const ages = ['young', 'teenage', 'adult', 'middle-aged', 'elderly'];
        // 性格特点
        const personalities = ['introverted', 'extroverted', 'cautious', 'adventurous', 'analytical', 
                             'creative', 'diplomatic', 'assertive', 'compassionate', 'realistic'];
        // 强项
        const strengths = ['intelligence', 'physical strength', 'creativity', 'determination', 
                          'empathy', 'leadership', 'adaptability', 'patience', 'courage', 'vision'];
        // 弱点
        const weaknesses = ['self-doubt', 'stubbornness', 'quick temper', 'indecisiveness', 
                          'overly trusting', 'perfectionism', 'impatience', 'fear of failure', 
                          'pride', 'reluctance to ask for help'];
        // 目标
        const goals = ['seeking knowledge', 'finding love', 'achieving fame', 'gaining power', 
                      'helping others', 'discovering truth', 'creating something lasting', 
                      'finding peace', 'seeking adventure', 'obtaining justice'];
        // 动机
        const motivations = ['personal growth', 'revenge', 'responsibility', 'curiosity', 
                            'love for someone', 'redemption', 'ambition', 'honor', 'fear', 'survival'];
        
        // 使用名称哈希选择属性
        const nameHash = getStringHash(name);
        
        // 确定性地选择属性
        attributes.age = ages[nameHash % ages.length];
        attributes.personality = personalities[(nameHash * 3) % personalities.length];
        
        // 选择两个不同的强项
        const strengthsArray = [];
        let firstStrengthIndex = nameHash % strengths.length;
        strengthsArray.push(strengths[firstStrengthIndex]);
        
        let secondStrengthIndex;
        do {
            secondStrengthIndex = (nameHash * 7) % strengths.length;
        } while(secondStrengthIndex === firstStrengthIndex);
        
        strengthsArray.push(strengths[secondStrengthIndex]);
        attributes.strengths = strengthsArray;
        
        // 选择弱点、目标和动机
        attributes.weakness = weaknesses[(nameHash * 11) % weaknesses.length];
        attributes.goal = goals[(nameHash * 13) % goals.length];
        attributes.motivation = motivations[(nameHash * 17) % motivations.length];
        
        return attributes;
    }

    // 显示角色属性
    function displayCharacterAttributes() {
        const attributesContainer = document.getElementById('characterAttributes');
        if (!attributesContainer) return;
        
        attributesContainer.classList.remove('hidden');
        
        // 创建DOM结构
        attributesContainer.innerHTML = `
            <div class="avatar-container">
                <div class="avatar" id="characterAvatar"></div>
            </div>
            <h3>${currentCharacter}'s Attributes</h3>
            <div class="attribute-group">
                <div class="attribute">
                    <span class="attribute-label">Age:</span> 
                    <span class="attribute-value">${characterAttributes.age}</span>
                </div>
                <div class="attribute">
                    <span class="attribute-label">Personality:</span> 
                    <span class="attribute-value">${characterAttributes.personality}</span>
                </div>
            </div>
            <div class="attribute-group">
                <div class="attribute">
                    <span class="attribute-label">Strengths:</span> 
                    <span class="attribute-value">${characterAttributes.strengths.join(', ')}</span>
                </div>
                <div class="attribute">
                    <span class="attribute-label">Weakness:</span> 
                    <span class="attribute-value">${characterAttributes.weakness}</span>
                </div>
            </div>
            <div class="attribute-group">
                <div class="attribute">
                    <span class="attribute-label">Goal:</span> 
                    <span class="attribute-value">${characterAttributes.goal}</span>
                </div>
                <div class="attribute">
                    <span class="attribute-label">Motivation:</span> 
                    <span class="attribute-value">${characterAttributes.motivation}</span>
                </div>
            </div>
        `;
        
        // 生成角色头像 - 先创建DOM，再生成头像
        generateCharacterAvatar(currentCharacter);
    }

    // 计算字符串哈希值
    function getStringHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // 转换为32位整数
        }
        return Math.abs(hash);
    }

    // 保存故事函数，独立出来方便调试
    function saveStory() {
        console.log("保存故事函数被调用");
        console.log("故事完成状态:", storyCompleted);
        console.log("故事长度:", currentStory.length);
        
        if (!storyCompleted || currentStory.length < 4) {
            alert('请先完成故事！');
            return;
        }
        
        console.log("准备保存故事...");
        
        try {
            // 按钮反馈效果
            const saveBtn = document.getElementById('saveStoryBtn');
            if (saveBtn) {
                saveBtn.classList.add('btn-clicked');
                setTimeout(() => {
                    saveBtn.classList.remove('btn-clicked');
                }, 200);
            }
            
            // 准备故事内容
            const title = `${currentCharacter}'s Story`;
            const content = title + '\n\n' + currentStory.join('\n\n');
            
            // 简单直接的下载方法
            const element = document.createElement('a');
            const file = new Blob([content], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = `${currentCharacter}_story.txt`;
            document.body.appendChild(element);
            element.click();
            
            // 延迟移除元素并释放URL
            setTimeout(() => {
                document.body.removeChild(element);
                URL.revokeObjectURL(element.href);
                console.log("下载元素已移除");
            }, 100);
            
            console.log("下载触发成功");
        } catch (error) {
            console.error("保存故事时出错:", error);
            
            // 备用方法：简单警告并复制到剪贴板
            alert("下载失败，将尝试复制到剪贴板");
            
            try {
                const title = `${currentCharacter}'s Story`;
                const content = title + '\n\n' + currentStory.join('\n\n');
                
                const textArea = document.createElement('textarea');
                textArea.value = content;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    alert("故事已复制到剪贴板！请粘贴并保存。");
                } else {
                    alert("无法复制到剪贴板。请手动复制故事文本。");
                }
            } catch (clipboardError) {
                console.error("剪贴板操作失败:", clipboardError);
                alert("保存功能不可用。请手动复制屏幕上的故事内容。");
            }
        }
    }
});
