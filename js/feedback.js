/**
 * FEEDBACK / MASUKAN
 * Form di footer mengirim masukan sebagai POST JSON ke KiloCode CLI
 * (lihat kilocode-cli.js). Endpoint dikonfigurasi di config.js.
 */

const Feedback = {
  init() {
    this.$form = DOM.$feedbackForm;
    this.$input = DOM.$feedbackInput;
    this.$send = DOM.$feedbackSend;
    this.$form.on('submit', (e) => this.submit(e));
  },

  async submit(e) {
    e.preventDefault();
    const text = this.$input.val().trim();
    if (!text) {
      toast('Masukan tidak boleh kosong');
      return;
    }
    if (!navigator.onLine) {
      toast('Koneksi internet tidak tersedia');
      return;
    }

    this.$send.prop('disabled', true);
    try {
      const res = await fetch(CONFIG.KILOCODE_CLI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          game: document.documentElement.dataset.game || 'snake',
          url: location.href,
          ts: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      toast('Masukan terkirim ke KiloCode CLI ✓');
      this.$input.val('');
    } catch (err) {
      console.error('Gagal mengirim masukan.', err);
      toast('Gagal kirim — pastikan KiloCode CLI berjalan');
    } finally {
      this.$send.prop('disabled', false);
    }
  }
};

$(function () {
  'use strict';
  Feedback.init();
});
