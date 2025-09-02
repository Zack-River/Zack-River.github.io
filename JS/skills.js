// Skills page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Animated counter for overview stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Skill cards animation observer
    const skillCardsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    
                    // Animate skill level bars
                    const levelFill = entry.target.querySelector('.level-fill');
                    if (levelFill) {
                        const level = levelFill.dataset.level;
                        setTimeout(() => {
                            levelFill.style.width = level + '%';
                        }, 300);
                    }
                }, index * 150);
                skillCardsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Database cards animation observer
    const databaseCardsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    
                    // Animate circular progress
                    const progressCircle = entry.target.querySelector('.progress-circle');
                    if (progressCircle) {
                        const progress = progressCircle.dataset.progress;
                        const degrees = (progress / 100) * 360;
                        setTimeout(() => {
                            progressCircle.style.background = `conic-gradient(var(--primary-color) ${degrees}deg, var(--border-color) ${degrees}deg)`;
                        }, 500);
                    }
                }, index * 200);
                databaseCardsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Tool categories animation observer
    const toolCategoriesObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
                toolCategoriesObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Overview stats counter observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Apply observers to elements
    document.querySelectorAll('.skill-card').forEach(card => {
        skillCardsObserver.observe(card);
    });
    
    document.querySelectorAll('.database-card').forEach(card => {
        databaseCardsObserver.observe(card);
    });
    
    document.querySelectorAll('.tool-category').forEach(category => {
        toolCategoriesObserver.observe(category);
    });
    
    document.querySelectorAll('.overview-stat .stat-number').forEach(counter => {
        statsObserver.observe(counter);
    });
    
    // Radar Chart Generation
    function createRadarChart() {
        const svg = document.querySelector('.radar-svg');
        const centerX = 200;
        const centerY = 200;
        const maxRadius = 150;
        const skills = [
            { name: 'Backend Development', value: 95, angle: 0 },
            { name: 'Database Design', value: 85, angle: 60 },
            { name: 'API Development', value: 90, angle: 120 },
            { name: 'Cloud Platforms', value: 75, angle: 180 },
            { name: 'Testing', value: 70, angle: 240 },
            { name: 'DevOps', value: 65, angle: 300 }
        ];
        
        // Clear existing content
        svg.innerHTML = '';
        
        // Create radar grid
        for (let i = 1; i <= 5; i++) {
            const radius = (maxRadius / 5) * i;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', centerX);
            circle.setAttribute('cy', centerY);
            circle.setAttribute('r', radius);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', 'var(--border-color)');
            circle.setAttribute('stroke-width', '1');
            circle.setAttribute('opacity', '0.3');
            svg.appendChild(circle);
        }
        
        // Create radar lines
        skills.forEach(skill => {
            const angle = (skill.angle - 90) * (Math.PI / 180);
            const x = centerX + Math.cos(angle) * maxRadius;
            const y = centerY + Math.sin(angle) * maxRadius;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centerX);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', x);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'var(--border-color)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('opacity', '0.3');
            svg.appendChild(line);
        });
        
        // Create skill polygon
        let pathData = '';
        skills.forEach((skill, index) => {
            const angle = (skill.angle - 90) * (Math.PI / 180);
            const radius = (skill.value / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        });
        pathData += ' Z';
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        polygon.setAttribute('d', pathData);
        polygon.setAttribute('fill', 'var(--primary-color)');
        polygon.setAttribute('fill-opacity', '0.2');
        polygon.setAttribute('stroke', 'var(--primary-color)');
        polygon.setAttribute('stroke-width', '2');
        svg.appendChild(polygon);
        
        // Create skill points
        skills.forEach(skill => {
            const angle = (skill.angle - 90) * (Math.PI / 180);
            const radius = (skill.value / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', 'var(--primary-color)');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);
        });
        
        // Position labels
        const labels = document.querySelectorAll('.radar-label');
        skills.forEach((skill, index) => {
            if (labels[index]) {
                const angle = (skill.angle - 90) * (Math.PI / 180);
                const labelRadius = maxRadius + 30;
                const x = centerX + Math.cos(angle) * labelRadius;
                const y = centerY + Math.sin(angle) * labelRadius;
                
                labels[index].style.left = `${(x / 400) * 100}%`;
                labels[index].style.top = `${(y / 400) * 100}%`;
            }
        });
    }
    
    // Initialize radar chart when it comes into view
    const radarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(createRadarChart, 500);
                radarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const radarChart = document.querySelector('.radar-chart');
    if (radarChart) {
        radarObserver.observe(radarChart);
    }
    
    // Enhanced hover effects for skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon-text');
            const levelFill = this.querySelector('.level-fill');
            
            if (icon) {
                icon.style.transform = 'translate(-50%, -50%) scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            if (levelFill) {
                levelFill.style.boxShadow = '0 0 10px var(--primary-color)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.icon-text');
            const levelFill = this.querySelector('.level-fill');
            
            if (icon) {
                icon.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            
            if (levelFill) {
                levelFill.style.boxShadow = 'none';
            }
        });
    });
    
    // Database card hover effects
    document.querySelectorAll('.database-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.database-icon');
            const progressCircle = this.querySelector('.progress-circle');
            
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            if (progressCircle) {
                progressCircle.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.database-icon');
            const progressCircle = this.querySelector('.progress-circle');
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            if (progressCircle) {
                progressCircle.style.boxShadow = 'none';
            }
        });
    });
    
    // Tool item click effects
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateX(5px)';
            }, 150);
        });
    });
    
    // Theme-aware radar chart updates
    window.addEventListener('themeChanged', function(e) {
        const isDark = e.detail.theme === 'dark';
        
        // Update radar chart colors
        setTimeout(() => {
            const svg = document.querySelector('.radar-svg');
            if (svg) {
                createRadarChart();
            }
        }, 100);
    });
    
    // Performance optimization: Pause animations when page is not visible
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;
        const animatedElements = document.querySelectorAll('.skill-card, .database-card, .tool-category');
        
        animatedElements.forEach(element => {
            if (isHidden) {
                element.style.animationPlayState = 'paused';
            } else {
                element.style.animationPlayState = 'running';
            }
        });
    });
    
    // Skill filtering functionality (bonus feature)
    function filterSkills(category) {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            const skillType = card.dataset.skill;
            if (category === 'all' || skillType === category) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    }
    
    // Export utility functions
    window.skillsPageUtils = {
        filterSkills,
        createRadarChart,
        animateCounter
    };
});