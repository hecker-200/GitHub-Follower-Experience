const btn = document.getElementById('know');
const txtInput = document.getElementById('txt');
const fol = document.getElementById('followers');
const matrixEl = document.getElementById('matrix');
const titleText = document.getElementById('titleText');
const usernameDisplay = document.getElementById('usernameDisplay');
const usernameReveal = document.getElementById('usernameReveal');
const travelingOrb = document.getElementById('travelingOrb');
const orbCounter = document.getElementById('orbCounter');

let currentUsername = "";
let hasSearched = false;

btn.addEventListener('click', () => {
  currentUsername = txtInput.value.trim();
  
  if(currentUsername === '') {
    alert('Please enter a GitHub username');
    return;
  }

  // Change button to loading state
  btn.classList.add('loading');
  btn.textContent = 'Journeying...';
  
  // Show and initialize the traveling orb from the portal
  travelingOrb.style.display = 'block';
  orbCounter.textContent = '0';
  gsap.to(travelingOrb, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: "back.out"
  });
  
  // Update title to show the journey beginning
  gsap.to(titleText, {
    duration: 0.5,
    text: `@${currentUsername}`,
    ease: "power2.inOut"
  });

  // Scroll to scene 2 smoothly
  const scene2 = document.querySelector('.scene-2');
  scene2.scrollIntoView({ behavior: 'smooth' });

  // Start the story journey
  const delay = setTimeout(() => {
    fetchGitHubData(currentUsername);
  }, 1500);
});

function fetchGitHubData(username) {
  const xh = new XMLHttpRequest();
  const str = `https://api.github.com/users/${username}`;

  xh.open("GET", str);

  xh.onreadystatechange = function(){
    if(xh.readyState === 4){
      btn.classList.remove('loading');
      btn.textContent = 'Begin Journey';
      
      if(xh.status === 200){
        const info = JSON.parse(this.responseText);
        const followerCount = info.followers;
        
        // Start the visual journey through scenes
        animateStoryJourney(followerCount, username);
        hasSearched = true;
      } else {
        alert('User not found. Please check the username.');
      }
    }
  }
  
  xh.onerror = function(){
    btn.classList.remove('loading');
    btn.textContent = 'Begin Journey';
    alert('Error fetching data. Please try again.');
  }

  xh.send();
}

function animateStoryJourney(followersCount, username) {
  // Scene 2: The Ascent - mountains and birds already animated
  const scene2 = document.querySelector('.scene-2');
  
  // Display username in scene 2
  usernameDisplay.textContent = `@${username}`;
  
  // Animate orb from portal to scene 2
  gsap.to(window, {
    scrollTo: {
      y: scene2.offsetTop,
      autoKill: false
    },
    duration: 2,
    ease: "power1.inOut"
  });

  // Animate orb to scene 2 position
  gsap.to(travelingOrb, {
    left: '10%',
    duration: 2,
    ease: "power1.inOut"
  });

  // Scene 3: The Data Stream
  setTimeout(() => {
    const scene3 = document.querySelector('.scene-3');
    const matrixText = generateMatrixText();
    matrixEl.textContent = matrixText;

    // Animate orb to scene 3 position
    gsap.to(travelingOrb, {
      left: '50%',
      top: '40vh',
      duration: 3,
      ease: "power1.inOut",
      delay: 2
    });

    // Progressively reveal follower count in orb (partial reveal)
    gsap.to(
      { val: 0 },
      {
        val: Math.floor(followersCount * 0.4),
        duration: 2,
        ease: "power1.out",
        onUpdate: function() {
          orbCounter.textContent = Math.floor(this.targets()[0].val);
        },
        delay: 2.5
      }
    );

    gsap.to(window, {
      scrollTo: {
        y: scene3.offsetTop,
        autoKill: false
      },
      duration: 3,
      ease: "power1.inOut",
      delay: 2
    });

    // Scene 4: The Peak
    setTimeout(() => {
      const scene4 = document.querySelector('.scene-4');
      
      // Animate orb to scene 4 position
      gsap.to(travelingOrb, {
        left: '80%',
        top: '35vh',
        duration: 3,
        ease: "power1.inOut"
      });

      // Further reveal (up to 70% of count)
      gsap.to(
        { val: Math.floor(followersCount * 0.4) },
        {
          val: Math.floor(followersCount * 0.7),
          duration: 2.5,
          ease: "power1.out",
          onUpdate: function() {
            orbCounter.textContent = Math.floor(this.targets()[0].val);
          }
        }
      );

      gsap.to(window, {
        scrollTo: {
          y: scene4.offsetTop,
          autoKill: false
        },
        duration: 3,
        ease: "power1.inOut"
      });

      // Scene 5: The Revelation
      setTimeout(() => {
        const scene5 = document.querySelector('.scene-5');
        
        // Animate orb to final position (above crown)
        gsap.to(travelingOrb, {
          left: '50%',
          top: '25vh',
          duration: 3,
          ease: "power1.inOut"
        });

        // Complete follower count reveal
        gsap.to(
          { val: Math.floor(followersCount * 0.7) },
          {
            val: followersCount,
            duration: 2,
            ease: "power1.out",
            onUpdate: function() {
              orbCounter.textContent = Math.floor(this.targets()[0].val);
            }
          }
        );

        gsap.to(window, {
          scrollTo: {
            y: scene5.offsetTop,
            autoKill: false
          },
          duration: 3,
          ease: "power1.inOut"
        });

        // Show the final follower count with animation
        setTimeout(() => {
          // Fade out orb as final count reveals
          gsap.to(travelingOrb, {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            ease: "power2.in",
            delay: 0.5
          });
          
          displayFinalCount(followersCount, username);
        }, 1000);
      }, 3500);
    }, 4000);
  }, 2500);
}

function generateMatrixText() {
  const chars = '01█▓░';
  let text = '';
  for(let i = 0; i < 200; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
    if(i % 20 === 0) text += '\n';
  }
  return text;
}

function displayFinalCount(count, username) {
  fol.textContent = count;
  fol.style.visibility = "visible";
  
  // Display username in final scene
  usernameReveal.textContent = `@${username}`;
  
  // Animate the count with GSAP
  gsap.from(fol, {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: "back.out"
  });

  // Trigger crown animation
  const crown = document.querySelector('.crown');
  gsap.from(crown, {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "back.out"
  });

  // Trigger username reveal animation
  gsap.from(usernameReveal, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "back.out",
    delay: 0.2
  });

  // Trigger achievement text animation
  const achievementText = document.querySelector('.achievement-text');
  gsap.from(achievementText, {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power2.out"
  });
  
  // Update the title to final state
  gsap.to(titleText, {
    duration: 0.8,
    delay: 0.5,
    text: `${username}'s Legacy`,
    ease: "power2.inOut"
  });
}

// Enable scrollbar for scrolling through the story
gsap.registerPlugin(ScrollTrigger);
