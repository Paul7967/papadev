'use client';

import { useState } from 'react';
import styles from './header.module.css';

type View = 'home' | 'blog' | 'courses';

interface HeaderProps {
  currentView: View;
  onNavigate?: (view: View) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' as View },
    { label: 'Courses', view: 'courses' as View },
    { label: 'Blog', view: 'blog' as View },
    { label: 'Dashboard', view: 'dashboard' as View },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div
            onClick={() => onNavigate('home')}
            className={styles.logoContainer}
          >
            <div className={styles.logoIcon}>
              <svg
                className={styles.logoIconSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <span className={styles.logoText}>EduLearn</span>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`${styles.navButton} ${
                  currentView === item.view ? styles.navButtonActive : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className={styles.desktopActions}>
            <button className={styles.buttonGhost}>Sign In</button>
            <button className={styles.buttonPrimary}>Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuButton}
          >
            {mobileMenuOpen ? (
              <svg
                className={styles.menuIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                className={styles.menuIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={styles.mobileNav}>
            <nav className={styles.mobileNavList}>
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`${styles.mobileNavButton} ${
                    currentView === item.view ? styles.mobileNavButtonActive : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className={styles.mobileActions}>
                <button className={`${styles.buttonGhost} ${styles.buttonFullWidth}`}>
                  Sign In
                </button>
                <button className={`${styles.buttonPrimary} ${styles.buttonFullWidth}`}>
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

