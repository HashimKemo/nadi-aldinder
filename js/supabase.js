const SUPABASE_URL = 'https://easlhsilbsnennpggpej.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhc2xoc2lsYnNuZW5ucGdncGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ2NTQsImV4cCI6MjA5NDUyMDY1NH0.xKGbWv1vrITvAwM6dg9EjkAI3sAi8uKbRNSK8JO2OoE';

const SUPABASE_FUNCTIONS_URL = SUPABASE_URL.replace('.supabase.co', '.supabase.co/functions/v1');

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var SUPABASE_PAUSED = false;

(async function checkSupabase() {
  try {
    var res = await supabaseClient.from('profiles').select('id', { count: 'exact', head: true }).limit(0);
    if (res.error) {
      if (res.error.code === 'PGRST301') SUPABASE_PAUSED = true;
      console.warn('⚠️ Supabase: ' + (res.error.message || 'غير متاح'));
    }
  } catch (e) {
    SUPABASE_PAUSED = true;
    console.warn('⚠️ Supabase DB: تعذر الاتصال — ' + e.message);
  }
  if (SUPABASE_PAUSED) {
    var banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#c0392b;color:#fff;text-align:center;padding:12px 16px;font-size:14px;font-family:sans-serif;';
    banner.textContent = '⚠️ قاعدة البيانات غير متاحة — تحقق من اتصالك أو راجع لوحة Supabase.';
    document.body.prepend(banner);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value.trim()) return;

      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      const { error } = await supabaseClient.from('subscribers').insert({ email: input.value.trim() });

      if (!error) {
        input.value = '';
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
      } else if (error.code === '23505') {
        btn.innerHTML = 'مشترك مسبقاً';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
      } else {
        btn.innerHTML = 'خطأ';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
      }
    });
  });
});
