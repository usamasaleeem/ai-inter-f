import { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  FileText,
  Sparkles,
  Link2,
  Upload,
  Download,
  Eye,
  EyeOff,
  Printer,
} from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Document, Page, Text, View, StyleSheet, Image, pdf, Svg, Path } from '@react-pdf/renderer';

// ---------- Types (unchanged) ----------
interface ResumeData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native';
}

// ---------- Initial Data ----------
const initialResumeData: ResumeData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
};

const generateId = () => Math.random().toString(36).substring(2, 11);

// ---------- Section Header (unchanged) ----------
const SectionHeader = ({ icon: Icon, title, onAdd, addLabel }: {
  icon: any;
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {onAdd && (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Plus className="h-4 w-4 mr-1" />
        {addLabel || 'Add'}
      </Button>
    )}
  </div>
);

// ---------- PDF Icon Components ----------
const PDFMailIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="2" fill="none" />
    <Path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" fill="none" />
  </Svg>
);

const PDFPhoneIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PDFMapPinIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 13a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PDFBriefcaseIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm1 13.5v-2h2v2h-2zm-1 0h-2v-2h2v2zm7 0h-2v-2h2v2zm3-6.5v4c0 .55-.45 1-1 1h-4v-2h-2v2h-4v-2H8v2H4c-.55 0-1-.45-1-1v-4h18z" fill="#6b7280" />
  </Svg>
);

const PDFGraduationIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="#6b7280" />
  </Svg>
);

const PDFCodeIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PDFAwardIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M12 15a5 5 0 100-10 5 5 0 000 10z" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 15v4M8 21h8M7 15l-3 6M17 15l3 6" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PDFFileTextIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ---------- SINGLE RESUME COMPONENT FOR BOTH RENDER AND EXPORT ----------
const ResumeContent = ({ 
  data, 
  isPDF = false,
  style = {}
}: { 
  data: ResumeData; 
  isPDF?: boolean;
  style?: any;
}) => {
  const { personal, experience, education, skills, certifications, projects, languages } = data;

  // PDF Styles
  const pdfStyles = StyleSheet.create({
   page: {
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    width: '100%', // Add this
    maxWidth: '100%', // Add this
  },
    header: {
      backgroundColor: '#2563eb',
      padding: 20,
      marginBottom: 20,
      borderRadius: 4,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    name: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      color: '#bfdbfe',
      fontSize: 16,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    contactText: {
      color: '#bfdbfe',
      fontSize: 10,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: '#6b7280',
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 4,
    },
    sectionTitleText: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: '#6b7280',
    },
    item: {
      marginBottom: 8,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemTitle: {
      fontWeight: 'bold',
      fontSize: 11,
    },
    itemSub: {
      fontSize: 10,
      color: '#4b5563',
    },
    itemDate: {
      fontSize: 9,
      color: '#9ca3af',
    },
    description: {
      fontSize: 10,
      color: '#374151',
      marginTop: 4,
      lineHeight: 1.4,
    },
    skillTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
      fontSize: 9,
      marginRight: 4,
      marginBottom: 4,
    },
    skillTagExpert: { backgroundColor: '#ede9fe', color: '#6b21a8' },
    skillTagAdvanced: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    skillTagIntermediate: { backgroundColor: '#d1fae5', color: '#065f46' },
    skillTagBeginner: { backgroundColor: '#f3f4f6', color: '#374151' },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    languageName: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    languageProficiency: {
      fontSize: 10,
      color: '#6b7280',
    },
    certificationItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    certificationName: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    certificationIssuer: {
      fontSize: 10,
      color: '#4b5563',
    },
    certificationDate: {
      fontSize: 9,
      color: '#9ca3af',
    },
    projectItem: {
      marginBottom: 8,
    },
    projectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    projectName: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    projectDate: {
      fontSize: 9,
      color: '#9ca3af',
    },
    projectDescription: {
      fontSize: 10,
      color: '#374151',
      marginTop: 2,
    },
    techTag: {
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 8,
      marginRight: 4,
    },
    link: {
      fontSize: 9,
      color: '#2563eb',
      textDecoration: 'underline',
    },
  });

  const getSkillStyle = (level: Skill['level']) => {
    if (isPDF) {
      switch (level) {
        case 'Expert': return pdfStyles.skillTagExpert;
        case 'Advanced': return pdfStyles.skillTagAdvanced;
        case 'Intermediate': return pdfStyles.skillTagIntermediate;
        default: return pdfStyles.skillTagBeginner;
      }
    }
    return {};
  };

  // HTML/CSS styles for web rendering
  const webStyles = {
    header: 'bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white',
    name: 'text-2xl font-bold',
    title: 'text-blue-100 text-lg',
    contactText: 'flex items-center gap-1 text-blue-100 text-sm',
    section: 'mb-6',
    sectionTitle: 'text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2',
    item: 'border-l-2 border-blue-200 pl-4 mb-4',
    itemHeader: 'flex justify-between items-start',
    itemTitle: 'font-semibold text-gray-900',
    itemSub: 'text-sm text-gray-600',
    itemDate: 'text-xs text-gray-500 whitespace-nowrap ml-4',
    description: 'text-sm text-gray-600 mt-2',
    skillTag: (level: Skill['level']) => {
      const base = 'px-3 py-1 rounded-full text-xs font-medium';
      switch (level) {
        case 'Expert': return `${base} bg-purple-100 text-purple-700`;
        case 'Advanced': return `${base} bg-blue-100 text-blue-700`;
        case 'Intermediate': return `${base} bg-green-100 text-green-700`;
        default: return `${base} bg-gray-100 text-gray-700`;
      }
    },
    languageItem: 'flex items-center gap-2',
    languageName: 'font-medium text-gray-900',
    languageProficiency: 'text-sm text-gray-500',
    certificationItem: 'flex justify-between items-start text-sm mb-2',
    certificationName: 'font-medium text-gray-900',
    certificationIssuer: 'text-gray-600',
    certificationDate: 'text-xs text-gray-500 whitespace-nowrap ml-4',
    projectItem: 'border-l-2 border-orange-200 pl-4 mb-4',
    projectHeader: 'flex justify-between items-start',
    projectName: 'font-semibold text-gray-900',
    projectDate: 'text-xs text-gray-500 whitespace-nowrap ml-4',
    projectDescription: 'text-sm text-gray-600 mt-1',
    techTag: 'px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs mr-1',
    link: 'text-xs text-blue-600 hover:underline mt-1 inline-block',
    avatar: 'w-24 h-24 rounded-full object-cover border-4 border-white/30',
    avatarPlaceholder: 'w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30',
    contactRow: 'flex flex-wrap gap-3 mt-2',
    summary: 'text-gray-700 text-sm leading-relaxed',
  };

  // Render the appropriate format
  if (isPDF) {
    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          {/* Header */}
          <View style={pdfStyles.header}>
            <View style={pdfStyles.headerContent}>
              {personal.photo ? (
                <Image src={personal.photo} style={pdfStyles.avatar} />
              ) : (
                <View style={[pdfStyles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ color: 'white', fontSize: 24 }}>👤</Text>
                </View>
              )}
              <View>
                <Text style={pdfStyles.name}>
                  {personal.firstName || 'First'} {personal.lastName || 'Last'}
                </Text>
                {personal.title && <Text style={pdfStyles.title}>{personal.title}</Text>}
                <View style={pdfStyles.contactRow}>
                  {personal.email && (
                    <View style={pdfStyles.contactItem}>
                      <PDFMailIcon />
                      <Text style={pdfStyles.contactText}>{personal.email}</Text>
                    </View>
                  )}
                  {personal.phone && (
                    <View style={pdfStyles.contactItem}>
                      <PDFPhoneIcon />
                      <Text style={pdfStyles.contactText}>{personal.phone}</Text>
                    </View>
                  )}
                  {personal.location && (
                    <View style={pdfStyles.contactItem}>
                      <PDFMapPinIcon />
                      <Text style={pdfStyles.contactText}>{personal.location}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Summary */}
          {personal.summary && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFFileTextIcon />
                <Text style={pdfStyles.sectionTitleText}>Professional Summary</Text>
              </View>
              <Text style={pdfStyles.description}>{personal.summary}</Text>
            </View>
          )}
          
          {/* Experience */}
          {experience.length > 0 && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFBriefcaseIcon />
                <Text style={pdfStyles.sectionTitleText}>Experience</Text>
              </View>
              {experience.map((exp) => (
                <View key={exp.id} style={pdfStyles.item}>
                  <View style={pdfStyles.itemHeader}>
                    <View>
                      <Text style={pdfStyles.itemTitle}>{exp.position}</Text>
                      <Text style={pdfStyles.itemSub}>{exp.company}</Text>
                    </View>
                    <Text style={pdfStyles.itemDate}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  {exp.location && <Text style={pdfStyles.itemSub}>{exp.location}</Text>}
                  {exp.description && <Text style={pdfStyles.description}>{exp.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFGraduationIcon />
                <Text style={pdfStyles.sectionTitleText}>Education</Text>
              </View>
              {education.map((edu) => (
                <View key={edu.id} style={pdfStyles.item}>
                  <View style={pdfStyles.itemHeader}>
                    <View>
                      <Text style={pdfStyles.itemTitle}>{edu.degree}</Text>
                      <Text style={pdfStyles.itemSub}>{edu.institution}</Text>
                      {edu.field && <Text style={pdfStyles.itemSub}>{edu.field}</Text>}
                    </View>
                    <Text style={pdfStyles.itemDate}>
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </Text>
                  </View>
                  {edu.gpa && <Text style={pdfStyles.description}>GPA: {edu.gpa}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFCodeIcon />
                <Text style={pdfStyles.sectionTitleText}>Skills</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {skills.map((skill) => (
                  <View key={skill.id} style={[pdfStyles.skillTag, getSkillStyle(skill.level)]}>
                    <Text>{skill.name}</Text>
                    {skill.level !== 'Intermediate' && <Text> ({skill.level})</Text>}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFAwardIcon />
                <Text style={pdfStyles.sectionTitleText}>Certifications</Text>
              </View>
              {certifications.map((cert) => (
                <View key={cert.id} style={pdfStyles.certificationItem}>
                  <Text style={pdfStyles.certificationName}>
                    {cert.name} <Text style={pdfStyles.certificationIssuer}>– {cert.issuer}</Text>
                  </Text>
                  <Text style={pdfStyles.certificationDate}>{cert.date}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFFileTextIcon />
                <Text style={pdfStyles.sectionTitleText}>Projects</Text>
              </View>
              {projects.map((project) => (
                <View key={project.id} style={pdfStyles.projectItem}>
                  <View style={pdfStyles.projectHeader}>
                    <Text style={pdfStyles.projectName}>{project.name}</Text>
                    <Text style={pdfStyles.projectDate}>
                      {project.startDate} – {project.endDate}
                    </Text>
                  </View>
                  <Text style={pdfStyles.projectDescription}>{project.description}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                    {project.technologies.map((tech, idx) => (
                      <View key={idx} style={pdfStyles.techTag}>
                        <Text>{tech}</Text>
                      </View>
                    ))}
                  </View>
                  {project.link && (
                    <Text style={pdfStyles.link}>{project.link}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={pdfStyles.section}>
              <View style={pdfStyles.sectionTitle}>
                <PDFFileTextIcon />
                <Text style={pdfStyles.sectionTitleText}>Languages</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {languages.map((lang) => (
                  <View key={lang.id} style={pdfStyles.languageItem}>
                    <Text style={pdfStyles.languageName}>{lang.name}</Text>
                    <Text style={pdfStyles.languageProficiency}>– {lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Page>
      </Document>
    );
  }

  // HTML/Web render (for preview)
  return (
    <div style={style} className="bg-white" id="resume-content">
      {/* Header */}
      <div className={webStyles.header}>
        <div className="flex items-start gap-4">
          {personal.photo ? (
            <img
              src={personal.photo}
              alt={`${personal.firstName} ${personal.lastName}`}
              className={webStyles.avatar}
              crossOrigin="anonymous"
            />
          ) : (
            <div className={webStyles.avatarPlaceholder}>
              <User className="h-12 w-12 text-white/70" />
            </div>
          )}
          <div className="flex-1">
            <h2 className={webStyles.name}>
              {personal.firstName || 'First'} {personal.lastName || 'Last'}
            </h2>
            {personal.title && (
              <p className={webStyles.title}>{personal.title}</p>
            )}
            <div className={webStyles.contactRow}>
              {personal.email && (
                <span className={webStyles.contactText}>
                  <Mail className="h-3 w-3" /> {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className={webStyles.contactText}>
                  <Phone className="h-3 w-3" /> {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className={webStyles.contactText}>
                  <MapPin className="h-3 w-3" /> {personal.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        {personal.summary && (
          <div className={webStyles.section}>
            <h3 className={webStyles.sectionTitle}>
              <FileText className="h-4 w-4" /> Professional Summary
            </h3>
            <p className={webStyles.summary}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className={webStyles.section}>
            <h3 className={webStyles.sectionTitle}>
              <Briefcase className="h-4 w-4" /> Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className={webStyles.item}>
                  <div className={webStyles.itemHeader}>
                    <div>
                      <h4 className={webStyles.itemTitle}>{exp.position}</h4>
                      <p className={webStyles.itemSub}>{exp.company}</p>
                    </div>
                    <span className={webStyles.itemDate}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-xs text-gray-400 mt-1">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className={webStyles.description}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className={webStyles.section}>
            <h3 className={webStyles.sectionTitle}>
              <GraduationCap className="h-4 w-4" /> Education
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-green-200 pl-4">
                  <div className={webStyles.itemHeader}>
                    <div>
                      <h4 className={webStyles.itemTitle}>{edu.degree}</h4>
                      <p className={webStyles.itemSub}>{edu.institution}</p>
                      {edu.field && (
                        <p className="text-sm text-gray-500">{edu.field}</p>
                      )}
                    </div>
                    <span className={webStyles.itemDate}>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className={webStyles.section}>
            <h3 className={webStyles.sectionTitle}>
              <Code className="h-4 w-4" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className={webStyles.skillTag(skill.level)}
                >
                  {skill.name} {skill.level !== 'Intermediate' && `(${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className={webStyles.section}>
            <h3 className={webStyles.sectionTitle}>
              <Award className="h-4 w-4" /> Certifications
            </h3>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className={webStyles.certificationItem}>
                  <div>
                    <span className={webStyles.certificationName}>{cert.name}</span>
                    <span className={webStyles.certificationIssuer}> - {cert.issuer}</span>
                  </div>
                  <span className={webStyles.certificationDate}>{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className={webStyles.section}>
            <h3 className={webStyles.sectionTitle}>
              <FileText className="h-4 w-4" /> Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className={webStyles.projectItem}>
                  <div className={webStyles.projectHeader}>
                    <h4 className={webStyles.projectName}>{project.name}</h4>
                    <span className={webStyles.projectDate}>
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <p className={webStyles.projectDescription}>{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className={webStyles.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={webStyles.link}>
                      <Link2 className="h-3 w-3 inline mr-1" /> Project Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className={webStyles.sectionTitle}>
              <FileText className="h-4 w-4" /> Languages
            </h3>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className={webStyles.languageItem}>
                  <span className={webStyles.languageName}>{lang.name}</span>
                  <span className={webStyles.languageProficiency}>- {lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Main ResumeBuilder Component ----------
export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  // ---------- Personal Info Handlers ----------
  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // ---------- Experience Handlers ----------
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const moveExperience = (id: string, direction: 'up' | 'down') => {
    setResumeData(prev => {
      const index = prev.experience.findIndex(exp => exp.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.experience.length) return prev;
      const newExperience = [...prev.experience];
      [newExperience[index], newExperience[newIndex]] = [newExperience[newIndex], newExperience[index]];
      return { ...prev, experience: newExperience };
    });
  };

  // ---------- Education Handlers ----------
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // ---------- Skill Handlers ----------
  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 'Intermediate',
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  // ---------- Certification Handlers ----------
  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // ---------- Project Handlers ----------
  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  // ---------- Language Handlers ----------
  const addLanguage = () => {
    const newLang: Language = {
      id: generateId(),
      name: '',
      proficiency: 'Professional',
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  // ---------- Photo Handler ----------
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        updatePersonal('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- PDF Export ----------
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await pdf(<ResumeContent data={resumeData} isPDF={true} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personal.firstName || 'Resume'}_${resumeData.personal.lastName || 'Builder'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ---------- Print Handler ----------
  const handlePrint = () => {
    const printContent = document.getElementById('resume-content');
    if (!printContent) return;

    const originalTitle = document.title;
    document.title = 'Resume';

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to print the resume');
      return;
    }

    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    let styleHTML = '';
    styles.forEach(style => {
      if (style.tagName === 'STYLE') {
        styleHTML += style.outerHTML;
      } else if (style.tagName === 'LINK') {
        styleHTML += style.outerHTML;
      }
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          ${styleHTML}
          <style>
            body { margin: 0; padding: 0; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
            #resume-content { width: 100%; margin: 0; background: white; }
            .no-print { display: none !important; }
            @media print { body { padding: 0; } #resume-content { border-radius: 0; box-shadow: none; } }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
    document.title = originalTitle;
  };

  // ---------- Edit Form ----------
  const renderEditForm = () => (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={User} title="Personal Information" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={resumeData.personal.firstName}
              onChange={(e) => updatePersonal('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={resumeData.personal.lastName}
              onChange={(e) => updatePersonal('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={resumeData.personal.title}
              onChange={(e) => updatePersonal('title', e.target.value)}
              placeholder="Senior Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={resumeData.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={resumeData.personal.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resumeData.personal.location}
              onChange={(e) => updatePersonal('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={resumeData.personal.summary}
              onChange={(e) => updatePersonal('summary', e.target.value)}
              placeholder="Experienced software engineer with 5+ years of experience..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </Button>
              {photoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPhotoPreview(null);
                    updatePersonal('photo', '');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={Briefcase} title="Work Experience" onAdd={addExperience} addLabel="Add Experience" />

        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="border border-gray-100 rounded-lg p-4 mt-4 relative group">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveExperience(exp.id, 'up')}
                className="h-6 w-6 p-0"
              >
                <MoveUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveExperience(exp.id, 'down')}
                className="h-6 w-6 p-0"
              >
                <MoveDown className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Job Title"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                  I currently work here
                </Label>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={GraduationCap} title="Education" onAdd={addEducation} addLabel="Add Education" />

        {resumeData.education.map((edu) => (
          <div key={edu.id} className="border border-gray-100 rounded-lg p-4 mt-4 relative group">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="University Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    disabled={edu.current}
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-edu-${edu.id}`}
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`current-edu-${edu.id}`} className="text-sm font-normal">
                  I'm currently studying here
                </Label>
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={Code} title="Skills" onAdd={addSkill} addLabel="Add Skill" />

        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="Skill name"
                className="border-0 bg-transparent p-0 h-auto w-24 text-sm focus:ring-0"
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', e.target.value as Skill['level'])}
                className="border-0 bg-transparent text-sm focus:ring-0"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={Award} title="Certifications" onAdd={addCertification} addLabel="Add Certification" />

        {resumeData.certifications.map((cert) => (
          <div key={cert.id} className="border border-gray-100 rounded-lg p-4 mt-4 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Certified Developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="space-y-2">
                <Label>Date Obtained</Label>
                <Input
                  type="date"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Credential ID (Optional)</Label>
                <Input
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="ABC123456"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={FileText} title="Projects" onAdd={addProject} addLabel="Add Project" />

        {resumeData.projects.map((project) => (
          <div key={project.id} className="border border-gray-100 rounded-lg p-4 mt-4 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies (comma separated)</Label>
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) => {
                    const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                    updateProject(project.id, 'technologies', techs);
                  }}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Project Link (Optional)</Label>
                <Input
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/your-project"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SectionHeader icon={FileText} title="Languages" onAdd={addLanguage} addLabel="Add Language" />

        <div className="flex flex-wrap gap-2">
          {resumeData.languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Input
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder="Language"
                className="border-0 bg-transparent p-0 h-auto w-24 text-sm focus:ring-0"
              />
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value as Language['proficiency'])}
                className="border-0 bg-transparent text-sm focus:ring-0"
              >
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Professional">Professional</option>
                <option value="Native">Native</option>
              </select>
              <button
                type="button"
                onClick={() => removeLanguage(lang.id)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sticky bottom-0 bg-gray-50 p-4 -mx-2 rounded-xl border border-gray-200">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            setResumeData(initialResumeData);
            setPhotoPreview(null);
          }}
        >
          Clear All
        </Button>
        <Button
          type="button"
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
          onClick={() => setPreviewMode('preview')}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Resume
        </Button>
      </div>
    </div>
  );

  // ---------- Main Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Hirel AI Resume Builder
            </h1>
            <p className="text-gray-600 mt-1">Build your professional resume with our easy-to-use builder</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {previewMode === 'preview' && (
              <>
                <Button
                  variant="default"
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode('edit')}
                  className="flex items-center gap-2"
                >
                  <EyeOff className="h-4 w-4" />
                  Back to Edit
                </Button>
              </>
            )}
            {previewMode === 'edit' && (
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Resume
              </Button>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Preview */}
          <div className="lg:order-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Resume Preview
              </h2>
              <ResumeContent data={resumeData} isPDF={false} />
            </div>
          </div>

          {/* Right Panel - Edit Form */}
          <div className="lg:order-2">
            <div className="bg-gray-50 rounded-xl p-4">
              {previewMode === 'edit' ? renderEditForm() : (
                <div className="text-center py-12">
                  <Eye className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview Mode</h3>
                  <p className="text-gray-600 mb-6">Review your resume before exporting</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button onClick={() => setPreviewMode('edit')} variant="outline">
                      <EyeOff className="h-4 w-4 mr-2" />
                      Return to Edit
                    </Button>
                    <Button
                      onClick={exportToPDF}
                      disabled={isExporting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}