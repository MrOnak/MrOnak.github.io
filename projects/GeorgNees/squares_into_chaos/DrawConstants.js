public static class DrawConstants {
  private static DrawConstants inst;

  private static float zoomFactor;
  private static float offsetX;
  private static float offsetY;

  private DrawConstants() {
    zoomFactor = 1.0;
    offsetX    = 0.0;
    offsetY    = 0.0;
  }

  public static DrawConstants getInstance() {
    if (inst == null) {
      inst = new DrawConstants();
    }

    return inst;
  }

  public void setZoomFactor(float factor) {
    zoomFactor = max(1, min(20, factor));
  }

  public void zoom(float dir) {
    zoomFactor = max(1, min(20, zoomFactor + dir));
  }

  public float getZoomFactor() {
    return zoomFactor;
  }

  public void setOffsetX(float x) {
    offsetX = x;
  }

  public void setOffsetY(float y) {
    offsetY = y;
  }

  public void moveOffset(float relX, float relY) {
    offsetX += relX;
    offsetY += relY;
  }

  public float getOffsetX() {
    return offsetX;
  }

  public float getOffsetY() {
    return offsetY;
  }
}
