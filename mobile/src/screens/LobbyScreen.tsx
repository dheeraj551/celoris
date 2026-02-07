import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Coffee, Briefcase, Code, ChevronRight, Users } from 'lucide-react-native';

const rooms = [
    {
        id: 'socialize',
        title: 'Hangout',
        description: 'Meet new people, share stories, and grow your global community.',
        icon: Coffee,
        color: '#10b981',
        activeCount: 12,
    },
    {
        id: 'networking',
        title: 'Professional',
        description: 'Connect with experts and mentors to help grow your career.',
        icon: Briefcase,
        color: '#06b6d4',
        activeCount: 0,
        locked: true,
    },
    {
        id: 'tech-trends',
        title: 'Tech Trends',
        description: 'Discuss the latest tech trends: AI, coding, and digital tools.',
        icon: Code,
        color: '#059669',
        activeCount: 0,
        locked: true,
    },
];

export const LobbyScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.title}>Public Rooms</Text>
                <Text style={styles.subtitle}>Social Network Online</Text>
            </View>

            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <item.icon color={item.color} size={32} />
                        </View>

                        <View style={styles.cardInfo}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.roomTitle}>{item.title}</Text>
                                {item.locked && (
                                    <View style={styles.lockedBadge}>
                                        <Text style={styles.lockedText}>LOCKED</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.description} numberOfLines={2}>
                                {item.description}
                            </Text>

                            <View style={styles.cardFooter}>
                                <View style={styles.stats}>
                                    <Users size={14} color="#64748b" />
                                    <Text style={styles.statsText}>{item.activeCount} ONLINE</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050810',
    },
    header: {
        padding: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#ffffff',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 4,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#0d1321',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'between',
        alignItems: 'center',
        marginBottom: 4,
    },
    roomTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    },
    description: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statsText: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: '900',
        letterSpacing: 1,
    },
    lockedBadge: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    lockedText: {
        fontSize: 8,
        color: '#64748b',
        fontWeight: '900',
    },
});
