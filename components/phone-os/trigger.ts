export function openPhoneOS(
  view: 'support' | 'whatschat' | 'jobs' | 'classrooms' | 'apps' = 'support',
  subTab?: 'chat' | 'lead' | 'faq'
) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('celoris:open-phone', {
        detail: { view, subTab },
      })
    );
  }
}
