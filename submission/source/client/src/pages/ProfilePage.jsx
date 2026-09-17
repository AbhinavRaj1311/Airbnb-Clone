import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Camera, LogOut, Pencil, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/auth/Avatar'
import Header from '../components/Header/Header'
import styles from './ProfilePage.module.css'

function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(user?.name || '')
  const [nameError, setNameError] = useState('')
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadMsg, setUploadMsg] = useState('')

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const saveName = async () => {
    if (!nameValue.trim()) return setNameError('Name cannot be empty')
    setNameError('')
    setSaving(true)
    try {
      await updateProfile({ name: nameValue.trim() })
      setEditingName(false)
    } catch {
      setNameError('Failed to update name')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadMsg('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadMsg('Image must be under 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result
      setAvatarPreview(dataUrl)
      setSaving(true)
      setUploadMsg('Uploading…')
      try {
        await updateProfile({ avatar: dataUrl })
        setUploadMsg('Avatar updated!')
        setTimeout(() => setUploadMsg(''), 3000)
      } catch {
        setUploadMsg('Upload failed. Try again.')
        setAvatarPreview(null)
      } finally {
        setSaving(false)
      }
    }
    reader.readAsDataURL(file)
  }, [updateProfile])

  const displayUser = avatarPreview ? { ...user, avatar: avatarPreview } : user

  return (
    <>
      <Helmet>
        <title>Profile · {user?.name} | StayGallery</title>
        <meta name="description" content="Manage your StayGallery profile, avatar, and account settings" />
      </Helmet>
      <Header />
      <main className={styles.page} id="profile-page">
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Your Profile</h1>

          <div className={styles.card}>
            {/* Avatar section */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap}>
                <Avatar user={displayUser} size="xl" />
                <button
                  className={styles.cameraBtn}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile photo"
                  id="change-avatar-btn"
                >
                  <Camera size={16} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleAvatarChange}
                id="avatar-file-input"
              />
              {uploadMsg && (
                <span className={`${styles.uploadMsg} ${uploadMsg.includes('failed') || uploadMsg.includes('must') || uploadMsg.includes('select') ? styles.uploadMsgError : ''}`}>
                  {uploadMsg}
                </span>
              )}
              <p className={styles.avatarHint}>Click the camera icon to change your photo</p>
            </div>

            {/* Name */}
            <div className={styles.infoSection}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Full name</span>
                {editingName ? (
                  <div className={styles.editRow}>
                    <input
                      className={styles.nameInput}
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setEditingName(false); setNameValue(user.name) } }}
                      autoFocus
                      id="edit-name-input"
                    />
                    <button className={styles.iconBtn} onClick={saveName} disabled={saving} aria-label="Save name">
                      <Check size={16} />
                    </button>
                    <button className={styles.iconBtn} onClick={() => { setEditingName(false); setNameValue(user?.name || '') }} aria-label="Cancel">
                      <X size={16} />
                    </button>
                    {nameError && <span className={styles.fieldError}>{nameError}</span>}
                  </div>
                ) : (
                  <div className={styles.infoValueRow}>
                    <span className={styles.infoValue} id="profile-name">{user?.name}</span>
                    <button
                      className={styles.editBtn}
                      onClick={() => { setEditingName(true); setNameValue(user?.name || '') }}
                      aria-label="Edit name"
                      id="edit-name-btn"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue} id="profile-email">{user?.email}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Member since</span>
                <span className={styles.infoValue}>{memberSince}</span>
              </div>
            </div>

            {/* Logout */}
            <div className={styles.logoutSection}>
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                id="profile-logout-btn"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ProfilePage
