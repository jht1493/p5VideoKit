function ui_live_selection() {
  let div = ui_div_empty('live_selection');

  let chk = createCheckbox('Live ', a_ui.live_chk);
  div.child(chk);
  chk.style('display:inline');
  chk.changed(function () {
    let a_live = this.checked();
    a_ui_set('live_chk', a_live ? 1 : 0);
    select('#ichat_blk').style(a_ui.live_chk ? 'display:inline' : 'display:none');
    livem_restore();
  });

  div.child(createSpan('Device: '));
  let aSel = createSelect();
  div.child(aSel);
  // aSel.option('Canvas', 0);
  for (let index = 0; index < a_media_panes.length; index++) {
    let ent = a_media_panes[index];
    // aSel.option(ent.label, index + 1);
    aSel.option(ent.label, index);
  }
  aSel.selected(a_ui.live_index);
  aSel.changed(function () {
    let index = parseFloat(this.value());
    console.log('ui_live_selection index', index);
    a_ui_set('live_index', index);
    let ent = media_for_livem_index(index);
    if (a_ui.live_chk) attach_livem(ent);
    else detach_livem(ent);
  });

  {
    let chk = createCheckbox('Data ', a_ui.canvas_data_chk);
    div.child(chk);
    chk.style('display:inline');
    chk.changed(function () {
      let state = this.checked();
      a_ui_set('canvas_data_chk', state ? 1 : 0);
    });
  }
}

function media_for_livem_index(index) {
  return a_media_panes[index];
}

function livem_restore() {
  if (!a_livem && a_ui.live_chk) {
    let ent = media_for_livem_index(a_ui.live_index);
    if (ent) attach_livem(ent);
  }
}
