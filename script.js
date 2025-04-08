document.addEventListener('DOMContentLoaded', function() {
    // 缓存DOM元素，减少查询
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

    // 图像缓存系统
    const imageCache = {};

    // 防抖函数：防止用户快速多次点击
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 预加载动画效果
    requestAnimationFrame(() => {
        characterNameInput.focus();
    });

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
            debouncedGenerateHeadcanon();
        }
    });

    // 使用防抖包装生成函数
    const debouncedGenerateHeadcanon = debounce(generateHeadcanon, 300);

    // 点击按钮生成设定 - 使用防抖函数避免多次快速点击
    generateBtn.addEventListener('click', debouncedGenerateHeadcanon);
    
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
        saveStoryBtn.addEventListener('click', function() {
            saveStory();
        });
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
        
        // 优化：创建文档片段减少DOM操作次数
        const fragment = document.createDocumentFragment();
        
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
            
            // 生成角色头像 - 使用requestAnimationFrame延迟到下一帧
            requestAnimationFrame(() => {
                generateCharacterAvatar(name);
            });
            
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
                storyCompleted = true;
                
                // 更新进度条
                updateProgressIndicators(currentStory.length);
                
                // 显示保存按钮
                if (saveStoryBtn) {
                    saveStoryBtn.classList.remove('hidden');
                }
            }
        }
        
        // 高效DOM更新：使用文档片段一次性更新所有内容
        currentStory.forEach(storyItem => {
            const p = document.createElement('p');
            p.textContent = storyItem;
            fragment.appendChild(p);
        });
        
        // 一次性更新DOM
        headcanonElement.innerHTML = '';
        headcanonElement.appendChild(fragment);
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
        
        // 为了性能，只使用一个requestAnimationFrame
        requestAnimationFrame(() => {
            const avatarElement = document.getElementById('characterAvatar');
            if (avatarElement) {
                // 清空之前的内容
                avatarElement.textContent = '';
                avatarElement.classList.add('loading');
                
                // 构建基于年龄和性别的本地图像路径
                const maxAvatarCount = gender === 'male' ? 11 : 5; // 男性有11个头像，女性有5个
                const avatarNumber = (nameHash % maxAvatarCount) + 1;
                const avatarPath = `images/avatars/${age}/${gender}/avatar${avatarNumber}.jpeg`;
                
                // 使用缓存系统加载图像
                loadAndCacheImage(avatarPath, avatarElement, () => {
                    // 成功加载本地图像
                    avatarElement.style.backgroundImage = `url('${avatarPath}')`;
                    avatarElement.classList.remove('loading');
                    avatarElement.classList.add('loaded');
                }, () => {
                    // 本地图像加载失败，使用备用在线头像
                    console.log("本地头像加载失败，使用备用网络头像");
                    
                    // 备用：使用根据名称生成的在线头像
                    const imageId = (nameHash % 100) + 1;
                    const genderStr = gender === 'male' ? 'men' : 'women';
                    const backupUrl = `https://randomuser.me/api/portraits/${genderStr}/${imageId}.jpg`;
                    
                    loadAndCacheImage(backupUrl, avatarElement, () => {
                        // 成功加载在线备用图像
                        avatarElement.style.backgroundImage = `url('${backupUrl}')`;
                        avatarElement.classList.remove('loading');
                        avatarElement.classList.add('loaded');
                    }, () => {
                        // 如果在线头像也失败，回退到字母头像
                        avatarElement.style.backgroundImage = 'none';
                        avatarElement.style.backgroundColor = backgroundColor;
                        avatarElement.textContent = name.charAt(0).toUpperCase();
                        avatarElement.classList.remove('loading');
                        avatarElement.classList.add('loaded');
                    });
                });
            }
        });
    }
    
    // 优化图像加载函数
    function loadAndCacheImage(url, element, onSuccess, onError) {
        // 检查缓存中是否有此图像
        if (imageCache[url]) {
            console.log("从缓存加载图像:", url);
            onSuccess();
            return;
        }
        
        const img = new Image();
        
        img.onload = function() {
            // 缓存成功加载的图像
            imageCache[url] = true;
            onSuccess();
        };
        
        img.onerror = function() {
            onError();
        };
        
        img.src = url;
    }
    
    // 优化进度条更新
    function updateProgressIndicators(step) {
        requestAnimationFrame(() => {
            for (let i = 0; i < progressDots.length; i++) {
                if (i < step) {
                    progressDots[i].classList.add('active');
                } else {
                    progressDots[i].classList.remove('active');
                }
                
                // 为点之间的线添加active类
                if (i < step - 1 && i < progressLines.length) {
                    progressLines[i].classList.add('active');
                } else if (i < progressLines.length) {
                    progressLines[i].classList.remove('active');
                }
            }
        });
    }

    // 生成角色属性
    function generateCharacterAttributes(name) {
        // 基本属性生成
        const nameHash = getStringHash(name);
        
        // 年龄组
        const ageGroups = ['child', 'teenage', 'adult', 'elderly'];
        const ageIndex = nameHash % ageGroups.length;
        
        // 性别 - 基于名称哈希
        const genders = ['male', 'female'];
        const genderIndex = Math.floor(nameHash / 10) % 2;
        
        // 人格特质 - 英文版
        const personalityTraits = [
            'introverted', 'extroverted', 'cautious', 'adventurous', 'analytical',
            'creative', 'diplomatic', 'assertive', 'compassionate', 'realistic',
            'imaginative', 'kind', 'sensitive', 'strong-willed', 'intelligent'
        ];
        
        // 选择2-3个性格特征
        const traitCount = 2 + (nameHash % 2);
        const selectedTraits = [];
        
        for (let i = 0; i < traitCount; i++) {
            const traitIndex = (nameHash + i * 13) % personalityTraits.length;
            if (!selectedTraits.includes(personalityTraits[traitIndex])) {
                selectedTraits.push(personalityTraits[traitIndex]);
            }
        }
        
        // 将特征连接成字符串
        const personalityDescription = selectedTraits.join(', ');
        
        return {
            age: ageGroups[ageIndex],
            gender: genders[genderIndex],
            personality: personalityDescription
        };
    }
    
    // 显示角色属性卡片
    function displayCharacterAttributes() {
        if (!attributesContainer) return;
        
        // 创建文档片段减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 显示角色卡片
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
                    <span class="attribute-label">Gender:</span> 
                    <span class="attribute-value">${characterAttributes.gender}</span>
                </div>
                <div class="attribute">
                    <span class="attribute-label">Personality:</span> 
                    <span class="attribute-value">${characterAttributes.personality}</span>
                </div>
            </div>
        `;
    }
    
    // 计算字符串的哈希值
    function getStringHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32bit整数
        }
        return Math.abs(hash);
    }
    
    // 保存故事功能
    function saveStory() {
        if (currentStory.length === 0 || !storyCompleted) {
            alert('Please complete the story first!');
            return;
        }
        
        // 创建一个包含所有故事内容的文本
        const storyText = currentStory.join('\n\n');
        const fileName = `${currentCharacter}'s Story.txt`;
        
        // 创建下载链接
        const blob = new Blob([storyText], { type: 'text/plain;charset=utf-8' });
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, 100);
        
        // 保存成功的反馈
        alert('Story saved successfully!');
    }
});
